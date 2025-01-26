import nodemailer from 'nodemailer';
import env from 'dotenv';

env.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // or process.env.EMAIL_PASSWORD
    },
});

const mailOptions = {
    from: process.env.EMAIL,
    to: 'nikhilpalem93466@gmail.com', // Replace with your email to test
    subject: 'Test Email',
    text: 'This is a test email to verify the correct password.',
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent:', info.response);
    }
});