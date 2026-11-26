import { query } from '../src/db.js';

async function main() {
  console.log('Synchronizing and updating payments in DB...');
  
  // 1. Update existing razorpay records to 'online'
  await query("UPDATE payments SET provider = 'online' WHERE provider = 'razorpay'");
  
  // 2. For paid online orders, set status = 'completed'
  await query("UPDATE payments SET status = 'completed' WHERE order_id IN (1, 2)");
  
  // 3. Ensure Order #3 (Cash/COD, Delivered) has payment record
  const p3 = await query('SELECT * FROM payments WHERE order_id = 3');
  if (!p3 || !p3.length) {
    const ord3 = await query('SELECT * FROM orders WHERE id = 3');
    if (ord3 && ord3.length) {
      await query(
        "INSERT INTO payments(order_id, user_id, provider, provider_order_id, amount, status, created_at) VALUES(?, ?, 'cash', 'cash_ord_3', ?, 'completed', ?)",
        [ord3[0].id, ord3[0].user_id, ord3[0].total, ord3[0].created_at || new Date()]
      );
      console.log('Inserted payment for Order #3 (Cash, Completed)');
    }
  }

  // 4. Check all orders and ensure payment records exist
  const orders = await query('SELECT * FROM orders');
  for (const ord of orders) {
    const pm = await query('SELECT * FROM payments WHERE order_id = ?', [ord.id]);
    if (!pm || !pm.length) {
      const prov = String(ord.payment_method).toLowerCase().includes('cod') || String(ord.payment_method).toLowerCase().includes('cash') ? 'cash' : 'online';
      const st = (ord.payment_status === 'paid' || ord.status === 'delivered') ? 'completed' : 'pending';
      await query(
        "INSERT INTO payments(order_id, user_id, provider, provider_order_id, amount, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [ord.id, ord.user_id || 1, prov, `${prov}_ord_${ord.id}`, ord.total, st, ord.created_at || new Date()]
      );
    }
  }

  const finalPayments = await query('SELECT id, order_id, provider, provider_order_id, amount, status FROM payments ORDER BY id ASC');
  console.log('Final Payments in DB:', finalPayments);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
