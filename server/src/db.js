import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const sslConfig = process.env.DB_SSL_CA
  ? { ca: fs.readFileSync(process.env.DB_SSL_CA) }
  : undefined;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Small helper so route handlers can stay one-liners:
 * const rows = await query("SELECT ...");
 */
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}
