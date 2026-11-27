import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'torado_store',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  ssl: (process.env.DB_SSL === 'true' || (process.env.DB_HOST && !['127.0.0.1', 'localhost'].includes(process.env.DB_HOST))) ? {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  } : undefined
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};
