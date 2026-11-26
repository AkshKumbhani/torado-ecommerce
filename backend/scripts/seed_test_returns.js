import { query, pool } from '../src/db.js';

async function seed() {
  const existing = await query('SELECT count(*) as c FROM returns_requests');
  if (existing[0].c === 0) {
    await query(
      "INSERT INTO returns_requests (order_id, user_id, customer_name, reason, status, refund_amount, admin_note) VALUES (?, 1, 'Aksh Kumbhani', 'Size is too large for oversized fit, requested exchange/refund', 'approved', 2064.00, 'Customer contacted via WhatsApp, pickup approved')",
      [3]
    );
    await query(
      "INSERT INTO returns_requests (order_id, user_id, customer_name, reason, status, refund_amount, admin_note) VALUES (?, 1, 'Aksh Kumbhani', 'Fabric color slightly darker than preview image', 'pending', 1677.00, 'Awaiting customer parcel handover')",
      [2]
    );
    console.log('Seeded 2 test return requests successfully.');
  } else {
    console.log('Return requests already exist:', existing[0].c);
  }
}

try {
  await seed();
} catch (e) {
  console.error(e);
} finally {
  await pool.end();
}
