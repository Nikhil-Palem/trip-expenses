import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from 'cors';
import nodemailer from 'nodemailer';
import env from 'dotenv';

env.config();
const app = express();
const saltRounds = 10;
const port = process.env.PORT;
console.log(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
    origin: 'https://trip-expenses-website.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_URL,
})
pool.connect((err)=>{
    if(err) throw err
    console.log("Connect to postgreSQL Successfull");
});

app.get("/",(req,res)=>{
    res.send("Server is running");
});

app.get("/PaidPage/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const details = await pool.query("SELECT * FROM paid_list WHERE user_id = $1", [user_id]);
        const Url=await pool.query("select profile_url from users where user_id=$1",[user_id]);
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
        if (Exists.rows.length > 0) {
            const user = Exists.rows[0];
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

app.post("/reset",async(req,res)=>{
    const {Email,NewPassword}=req.body;
    if(!Email || !NewPassword){
        res.send({error:"Enter Valid Password"});
    }
    try{
        const hashedPassword=await bcrypt.hash(NewPassword,saltRounds);
        await pool.query("update users set password=$1 where email=$2",[hashedPassword,Email]);
        res.send({success:"password updated successfully"});    
    }catch(err){
        res.send({error:"Database Error"})
    }
})

app.post("/contact",async(req,res)=>{
    const {Name,UserEmail,Msg}=req.body;
    console.log(UserEmail);
    try{
        const mailOptions={
            from:UserEmail,
            replyTo:UserEmail,
            to:process.env.EMAIL,
            subject:`User Message from ${Name}`,
            text:`User Message:${Msg}`,
        }
        transporter.sendMail(mailOptions,(err,info)=>{
            if (err) {
                res.send({ error: "Failed to send Message", err });
                return;
            } else {
                console.log(info.response);
                res.send({ success: "Messge sent..." });
            }
        })
    }catch(error){
        res.send({error:"Database error"});
    }
})

app.post("/profile_url",async(req,res)=>{
    const {url,User_Id}=req.body;
    try{
        const urlupdate=await pool.query("update users set profile_url=$1 where user_id=$2",[url,User_Id]);
        res.send({success:`url:${urlupdate}`});
    }catch(err){
        res.send({error:"Database error"});
    }
})

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});

// module.exports=pool;