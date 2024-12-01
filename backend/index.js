import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from 'cors';
import nodemailer from 'nodemailer';
import env from 'dotenv';
import { OAuth2Client } from "google-auth-library";

env.config();
const app = express();
const saltRounds = 10;
const port = process.env.PORT;
console.log(port);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors());

// app.use(cors({
//     origin: ['http://localhost:5173', 'https://trip-expenses-website.vercel.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_URL,
});

pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     port: process.env.PG_PORT,
//   });
//   db.connect(); 

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/PaidPage/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const details = await pool.query("SELECT * FROM paid_list WHERE user_id = $1", [user_id]);
        const Url = await pool.query("select profile_url from users where user_id=$1", [user_id]);
        res.json({
            profile_url: Url.rows[0]?.profile_url,
            details: details.rows
        });

    } catch (err) {
        console.log("Database query error:", err);
        res.json({ error: "Server side error" });
    }
});

app.post("/signup", async (req, res) => {
    const { username, password, Email } = req.body;
    try {
        const checkExistsEmail = await pool.query("SELECT * FROM users WHERE email=$1", [Email]);
        const checkExistsUser = await pool.query("select * from users where username=$1", [username]);
        if (checkExistsEmail.rows.length > 0) {
            res.json({ error: "email already exists..." });
        }
        else if (checkExistsUser.rows.length > 0) {
            res.json({ error: "username already exists..." });
        } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    console.log("error during hashing", err);
                } else {
                    const result = await pool.query("INSERT INTO users (username, password,email) VALUES ($1, $2,$3) RETURNING *", [username, hash, Email]);
                    res.json(result.rows[0]);
                    console.log(username, hash, Email);
                }
            })
        }
    } catch (err) {
        // console.log(err);
        res.json({ error: "internal server error..." })
    }
});

app.post("/signIn", async (req, res) => {
    const { username, password } = req.body;
    try {
        const Exists = await pool.query("select * from users where username=$1", [username]);
        const user = Exists.rows[0];
        if(user.password==="google"){
            return res.json({error:"Please sigin with Google (or) Reset Password"});
        }
        if (Exists.rows.length > 0) {
            const hashedPassword = user.password;
            console.log(hashedPassword);
            bcrypt.compare(password, hashedPassword, (err, valid) => {
                if (err) {
                    console.log("Error comparing passwords", err);
                    res.json({ error: "Internel Server error" });
                } else {
                    if (valid) {
                        res.json(user);
                    } else {
                        res.json({ error: "Incorrect Password" });
                    }
                }
            })
        } else {
            res.json({ error: "user doesn't exists please signup" });
        }

    } catch (err) {
        console.log("db error", err);
        res.json({ error: "Internel Server error" });
    }
});

app.post("/PaidPage", async (req, res) => {
    const { item_id, user_id, Payername, Itemname, Amountpaid, PaidDate } = req.body;
    console.log(req.body);
    try {
        const details = await pool.query("INSERT INTO paid_list (item_id,user_id,Payername,Itemname,Amountpaid,PaidDate) VALUES ($1,$2,$3,$4,$5,$6)", [item_id, user_id, Payername, Itemname, Amountpaid, PaidDate]);
        res.json(details.rows[0]);
    } catch (err) {
        console.log("Database query error:", err.message);
        res.json({ error: `server side error,${err.message}` });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

app.post("/send_recovery_email", async (req, res) => {
    const { OTP, Email } = req.body;
    try {
        const EmailExists = await pool.query("select * from users where email=$1", [Email]);
        if (EmailExists.rows.length == 0) {
            res.send({ error: "user not found" });
            return;
        }
        else {
            const mailOptions = {
                from: process.env.EMAIL,
                to: Email,
                subject: 'Password Recovery',
                text: `Your OTP for password recovery is: ${OTP}`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.send({ error: "Failed to send recovery email", err });
                    return;
                } else {
                    console.log(info.response);
                    res.send({ success: "Recovery email sent" });
                }
            });


        }
    } catch (error) {
        res.send({ error: "Database error" });
    }
});

app.post("/reset", async (req, res) => {
    const { Email, NewPassword } = req.body;
    if (!Email || !NewPassword) {
        res.send({ error: "Enter Valid Password" });
    }
    try {
        const hashedPassword = await bcrypt.hash(NewPassword, saltRounds);
        await pool.query("update users set password=$1 where email=$2", [hashedPassword, Email]);
        res.send({ success: "password updated successfully" });
    } catch (err) {
        res.send({ error: "Database Error" })
    }
})

app.post("/contact", async (req, res) => {
    const { Name, UserEmail, Msg } = req.body;
    console.log(UserEmail);
    try {
        const mailOptions = {
            from: UserEmail,
            replyTo: UserEmail,
            to: process.env.EMAIL,
            subject: `User Message from ${Name}`,
            text: `User Message:${Msg}`,
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.send({ error: "Failed to send Message", err });
                return;
            } else {
                console.log(info.response);
                res.send({ success: "Messge sent..." });
            }
        })
    } catch (error) {
        res.send({ error: "Database error" });
    }
})

app.post("/profile_url", async (req, res) => {
    const { url, User_Id } = req.body;
    try {
        const urlupdate = await pool.query("update users set profile_url=$1 where user_id=$2", [url, User_Id]);
        res.send({ success: `url:${urlupdate}` });
    } catch (err) {
        res.send({ error: "Database error" });
    }
})

app.post('/google-signIn', async (req, res) => {
    const { token } = req.body;
    console.log(token);
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email } = payload;
        console.log("Received token:", token);
        console.log("Payload email:", email);

        const result = await pool.query("select * from users where email=$1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.status(200).json({ success: true, user_id: user.user_id, username: user.username, profile_url: user.profile_url });
            console.log("successfull");
        } else {
            res.status(500).json({ success: false, message: 'user not found' });
        }
    } catch (error) {
        console.log('db google auth failed', error);
        res.status(404).json({ success: false, message: 'Google auth failed' });
    }
})

app.post('/google-signUp', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(200).json({ success: true, message: 'User already exists' });
        }else{
            const result = await pool.query("insert into users(username, password,email,profile_url) VALUES ($1, $2,$3) RETURNING *",[name,'google',email,picture]);
            res.status(200).json({success:true,user:result.rows[0]});
        }

    } catch (error) {
        res.status(404).json({ success: false, errorMessage: 'Google auth failed' })
    }
})

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});
