
import('./src/db.js').then(async m => {
  const products = await m.query('SELECT id, name, status, category FROM products');
  console.log('Total products in DB:', products.length);
  for (const p of products) {
    if (p.status === 'inactive') console.log('INACTIVE IN DB:', p);
  }
  process.exit(0);
});
