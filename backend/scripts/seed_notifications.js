import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import { query } from '../src/db.js';

async function main() {
  await query('DELETE FROM notifications');
  await query(`
    INSERT INTO notifications (type, title, body, read_at, created_at)
    VALUES
      ('order', 'New Order #TRD-4 Confirmed', 'Customer aksh kumbhani placed an order for ₹1,577.00 via Razorpay (pay_U4kOYA0xUHnHqm).', NULL, NOW()),
      ('order', 'COD Order #TRD-3 Delivered', 'Cash on delivery order #TRD-3 for ₹2,064.00 was marked as delivered to Aksh Kumbhani.', '2026-11-26 10:00:00', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
      ('refund', 'Refund Processed for #TRD-3', 'Processed ₹2,064.00 refund to Aksh Kumbhani (akshkumbhani9@gmail.com).', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
      ('inventory', 'Low Stock Alert: Olive Nature Tee', 'Product "Olive Nature Tee" has only 3 items left in stock.', NULL, DATE_SUB(NOW(), INTERVAL 30 MINUTE))
  `);

  const rows = await query('SELECT * FROM notifications ORDER BY id DESC');
  console.log('Seeded notifications count:', rows.length);
  console.log(rows);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
