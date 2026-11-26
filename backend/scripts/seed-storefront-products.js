import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
const { pool } = await import('../src/db.js');

try {
  const seedPath = new URL('../../database/products/storefront-seed.sql', import.meta.url);
  const statements = (await readFile(seedPath, 'utf8'))
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) await pool.query(statement);
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM products WHERE sku LIKE 'TORADO-FRONT-%'");
  console.log(`Storefront products are ready in torado_store (${count} products).`);
} catch (error) {
  console.error(`Could not seed storefront products: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
