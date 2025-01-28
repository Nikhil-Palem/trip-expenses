import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../models/db.js';
const saltRounds = 10;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
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
}

export const signIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const Exists = await pool.query("select * from users where username=$1", [username]);
        const user = Exists.rows[0];
        if (user.password === "google") {
            return res.json({ error: "Please sigin with Google (or) Reset Password" });
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
}

export const googleSignIn = async (req, res) => {
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
        const { email, picture } = payload;
        console.log("Received token:", token);
        console.log("Payload email:", email);

        const result = await pool.query("select * from users where email=$1", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.password !== 'google') {
                // If the user exists but hasn't linked to Google, update their account
                await pool.query(
                    "UPDATE users SET password = $1, profile_url = $2 WHERE email = $3",
                    ['google', picture, email]
                );
                console.log("Google account linked to an existing user.");
            }

            res.status(200).json({ success: true, user_id: user.user_id, username: user.username, profile_url: user.profile_url || picture, email: user.email });
            console.log("successfull");
        } else {
            res.status(500).json({ success: false, message: 'user not found' });
        }
    } catch (error) {
        console.log('db google auth failed', error);
        res.status(404).json({ success: false, message: 'Google auth failed' });
    }
}

export const googleSignUp = async (req, res) => {
    console.log("response received");
    const { token } = req.body;
    console.log("Received authorization code:", token);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("Decoded payload:", payload);

        const { name, email, picture } = payload;

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length > 0) {
            return res.status(200).json({
                success: true,
                user: userCheck.rows[0],
                errorMessage: 'User already exists',
            });
        } else {
            const result = await pool.query("INSERT INTO users(username, password, email, profile_url) VALUES ($1, $2, $3, $4) RETURNING *", [name, 'google', email, picture]);
            return res.status(200).json({ success: true, user: result.rows[0] });
        }
    } catch (error) {
        // Log the actual error
        console.error("Error during Google sign-up process:", error);

        // Respond with a generic message, but log detailed error info for internal review
        res.status(500).json({ success: false, errorMessage: 'Google auth failed, please try again later.' });
    }
}
