import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING || null;

const pool = new Pool(
  connectionString ? { connectionString } : {
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASS,
  }
);

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

export default query;