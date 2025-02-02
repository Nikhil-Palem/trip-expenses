import pkg from 'pg';
import env from 'dotenv';
env.config();

const { Pool } = pkg;

const connectionString = process.env.POSTGRES_URL_URL;

if (!connectionString) {
    console.error('POSTGRES_URL is not set in the environment variables');
    process.exit(1);
}

export const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const connectToDatabase = () => {
    pool.connect()
        .then(() => console.log('Connected to database'))
        .catch(err => console.error('Error connecting to the database:', err));
};