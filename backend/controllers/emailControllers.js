import nodemailer from "nodemailer";
import { pool } from "../models/db.js";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const recovery_email = async (req, res) => {
    const { Email, OTP } = req.body;
    console.log('Received request to send recovery email:', Email, OTP);
    try {
        const EmailExists = await pool.query("select * from users where email=$1", [Email]);
        if (EmailExists.rows.length == 0) {
            console.log('Email not found in the database');
            res.send({ error: "user not found" });
            return;
        } else {
            const mailOptions = {
                from: process.env.EMAIL,
                to: Email,
                subject: 'Password Recovery OTP',
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f9f9f9;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #ffffff;
                    }
                    .header {
                        font-size: 20px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .content {
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2c7be5;
                        margin: 20px 0;
                        display: inline-block;
                        padding: 10px 20px;
                        border: 1px dashed #2c7be5;
                        border-radius: 5px;
                    }
                    .footer {
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Password Recovery OTP</div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>You have requested to recover your password. Please use the following One-Time Password (OTP) to proceed:</p>
                        <div class="otp">${OTP}</div>
                        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        Best regards,<br>
                        <strong>Trip Expenses</strong>
                    </div>
                </div>
            </body>
            </html>
                `,
            };



            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                    res.send({ error: "Failed to send recovery email", details: err.message });
                    return;
                }
                console.log('Recovery email sent successfully:', info.response);
                res.send({ success: "Recovery email sent" });
            });
        }
    } catch (error) {
        console.error('Error in /send_recovery_email:', error);
        res.send({ error: "Database error" });
    }
};

export const reset = async (req, res) => {
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
}

export const contact = async (req, res) => {
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
}

export const report_problem = async (req, res) => {
    const { Email, ReportText, user_name } = req.body;
    try {
        const result = await pool.query("select * from users where email=$1", [Email]);
        if (result.rows.length > 0) {
            const mailOptions = {
                from: Email,
                to: process.env.EMAIL,
                subject: 'User Reported Issue',
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .content {
                        margin-bottom: 20px;
                    }
                    .footer {
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                        margin-top: 20px;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">User Reported Issue</div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>A user has reported a problem. Here are the details:</p>
                        <ul>
                            <li><span class="highlight">User Email:</span> ${Email}</li>
                            <li><span class="highlight">Report Date:</span> ${new Date().toLocaleString()}</li>
                            <li><span class="highlight">Issue Description:</span> ${ReportText}</li>
                        </ul>
                        <p>Please address this issue promptly.</p>
                    </div>
                    <div class="footer">
                        Best regards,<br>
                        <strong>Trip Expenses</strong>
                    </div>
                </div>
            </body>
            </html>
                `,
            };


            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                    res.send({ error: "Failed to send report", details: err.message });
                    return;
                }
                console.log('Report sent successfully:', info.response);
                res.send({ success: "Report sent" });
            });
        } else {
            res.send({ error: "User Not Found" });
        }
    } catch (err) {
        res.send({ error: "Database Error" });
    }
}