import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { DATABASE_URL } = process.env;

const { Pool } = pg;

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});