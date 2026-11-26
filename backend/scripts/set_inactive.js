import { pool, query } from '../src/db.js';
async function run() {
  await query('UPDATE products SET status = \'inactive\' WHERE id = 5');
  console.log('ID 5 is inactive');
  await pool.end();
}
run();