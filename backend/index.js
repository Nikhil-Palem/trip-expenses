import express, { query } from "express";
import cors from 'cors';
import env from 'dotenv';
import routes from './routes/routes.js';
env.config();
import { connectToDatabase } from './models/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://trip-expenses-website.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


connectToDatabase();

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});
