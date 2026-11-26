import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { pool, query } from '../src/db.js';
try {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Store admin' } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env.');
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await query("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'admin') ON DUPLICATE KEY UPDATE name=VALUES(name),password_hash=VALUES(password_hash),role='admin'", [ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), hash]);
  console.log(`Admin account ready: ${ADMIN_EMAIL}`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { await pool.end(); }
