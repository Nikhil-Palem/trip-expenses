import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from 'cors';
// import Login from '../src/components/Login'
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "traval_book",
    password: "Nani@2003",
    port: "5432",
});
db.connect();


app.get("/PaidPage/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const details = await db.query("SELECT * FROM paid_list WHERE user_id = $1", [user_id]);
        res.json(details.rows);
    } catch (err) {
        console.log("Database query error:", err);
        res.json({ error: "Server side error" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const checkExists = await db.query("SELECT * FROM users WHERE username=$1", [username]);
        if (checkExists.rows.length > 0) {
            res.json({ error: "username already exists..." })
        } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    console.log("error during hashing",err);
                } else {
                    const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, hash]);
                    res.json(result.rows[0]);
                    console.log(username,hash);
                }
            })
        }
    } catch (err) {
        // console.log(err);
        res.json({ error: "internal server error..." })
    }
});

app.post("/signIn",async(req,res)=>{
    const {username,password}=req.body;
    try{
        const Exists=await db.query("select * from users where username=$1",[username]);
        if (Exists.rows.length > 0) {
            const user=Exists.rows[0];
            const hashedPassword=user.password;
            console.log(hashedPassword);
            bcrypt.compare(password,hashedPassword,(err,valid)=>{
                if(err){
                    console.log("Error comparing passwords",err);
                    res.json({error:"Internel Server error"});
                }else{
                    if(valid){
                        res.json(user);
                    }else{
                        res.json({error:"Incorrect Password"});
                    }
                }
            })
        }else{
            res.json({error:"user doesn't exists please signup"});
        }

    }catch(err){
        console.log("db error",err);
        res.json({error:"Internel Server error"});
    }
});

app.post("/PaidPage",async(req,res)=>{
    const {item_id,user_id,Payername,Itemname,Amountpaid,PaidDate}=req.body;
    console.log(req.body);
    try{
        const details=await db.query("INSERT INTO paid_list (item_id,user_id,Payername,Itemname,Amountpaid,PaidDate) VALUES ($1,$2,$3,$4,$5,$6)",[item_id,user_id,Payername,Itemname,Amountpaid,PaidDate]);
        res.json(details.rows[0]);
    }catch(err){
        console.log("Database query error:", err);
        res.json({error:"server side error"});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});