import { pool, query } from '../src/db.js';

async function run() {
  await query("UPDATE products SET status = 'inactive' WHERE name = \"Men's purple cotton t-shirt\"");
  const p = await query("SELECT id, name, status FROM products WHERE name = \"Men's purple cotton t-shirt\"");
  console.log('Sync result:', p);
  await pool.end();
}

run().catch(console.error);
