import { Router } from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import { pool, query } from '../src/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  sendOrderConfirmationEmail,
  sendOnlinePaymentSuccessEmail,
  sendCodCashCollectedEmail,
  sendOrderDeliveredEmail,
  sendRefundProcessedEmail
} from '../services/emailService.js';
import { sendWhatsAppOrderConfirmation } from '../services/whatsappService.js';
const router = Router();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_ToSrGTcWCONzuH';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'ucyG7kyunsTa5aWx6LbKGeKn';
const gateway = () => (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET }) : null;

router.get('/razorpay/key', async (_req, res) => {
  res.json({
    success: true,
    key: RAZORPAY_KEY_ID
  });
});

const resolveCustomer = async (req) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id) {
        const [u] = await query('SELECT id, name, email FROM users WHERE id=?', [decoded.id]);
        if (u) return u;
      }
    } catch {}
  }
  const email = (req.body.customerEmail || '').toLowerCase().trim();
  const name = (req.body.customerName || '').trim();
  if (email) {
    const [u] = await query('SELECT id, name, email FROM users WHERE email=? LIMIT 1', [email]);
    if (u) return u;
    // Insert new guest customer
    const res = await query('INSERT INTO users(name, email, role) VALUES(?, ?, ?)', [name || 'Customer', email, 'customer']);
    return { id: res.insertId, name: name || 'Customer', email };
  }
  return { id: 2, name: name || 'Aksh Kumbhani', email: 'akshkumbhani9@gmail.com' };
};

router.post('/razorpay/order', async (req,res,next)=>{let connection;try{
  const rzp=gateway();if(!rzp)return res.status(503).json({message:'Razorpay is not configured yet.'});
  if(!Array.isArray(req.body.items)||!req.body.items.length)return res.status(400).json({message:'Your cart is empty.'});
  const customer = await resolveCustomer(req);
  connection=await pool.getConnection();await connection.beginTransaction();let subtotal=0;const lines=[];
  for(const item of req.body.items){const quantity=Math.floor(Number(item.quantity));if(!Number.isInteger(quantity)||quantity<1||quantity>25)throw Object.assign(new Error('Invalid item quantity.'),{status:400,expose:true});const [products]=await connection.execute("SELECT id,name,price,stock FROM products WHERE id=? AND status='active' FOR UPDATE",[item.id]);let product=products[0];if(!product){const [fallback]=await connection.execute("SELECT id,name,price,stock FROM products WHERE status='active' LIMIT 1");product=fallback[0];}if(!product)throw Object.assign(new Error('A product in your cart is no longer available.'),{status:409,expose:true});subtotal+=Number(product.price)*quantity;lines.push({product,quantity,size:item.size||null,color:item.color||null});}
  let discount=0;let couponId=null;if(req.body.couponCode){const [coupons]=await connection.execute("SELECT * FROM coupons WHERE code=? AND active=1 AND (starts_at IS NULL OR starts_at<=NOW()) AND (expires_at IS NULL OR expires_at>=NOW()) AND (usage_limit IS NULL OR usage_count<usage_limit) FOR UPDATE",[String(req.body.couponCode).trim().toUpperCase()]);const coupon=coupons[0];if(!coupon||subtotal<Number(coupon.minimum_order))throw Object.assign(new Error('Coupon is invalid, expired, or the cart does not meet its minimum.'),{status:400,expose:true});const raw=coupon.discount_type==='percentage'?subtotal*Number(coupon.discount_value)/100:Number(coupon.discount_value);discount=Math.min(subtotal,raw,coupon.maximum_discount==null?subtotal:Number(coupon.maximum_discount));couponId=coupon.id;}
  const shippingCost = Number(req.body.shippingCost || 49);
  const total = Math.max(0, subtotal - discount + shippingCost);
  if (total < 1) throw Object.assign(new Error('Order total must be at least ₹1.'), { status: 400, expose: true });
  const gatewayOrder = await rzp.orders.create({ amount: Math.round(total * 100), currency: 'INR', receipt: `torado-${Date.now()}` });
  const shippingAddr = req.body.shippingAddress || null;
  const [created] = await connection.execute(
    "INSERT INTO orders(user_id,customer_name,customer_email,shipping_address,subtotal,total,payment_method,coupon_code,payment_status,status) VALUES(?,?,?,?,?,?,?,'online',?,'pending','pending')",
    [customer.id, customer.name, customer.email, shippingAddr ? JSON.stringify(shippingAddr) : null, subtotal, total, couponId ? String(req.body.couponCode).trim().toUpperCase() : null]
  );
  for (const line of lines) {
    await connection.execute('INSERT INTO order_items(order_id,product_id,product_name,quantity,unit_price,size,color) VALUES(?,?,?,?,?,?,?)', [created.insertId, line.product.id, line.product.name, line.quantity, line.product.price, line.size, line.color]);
    await connection.execute('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [line.quantity, line.product.id]);
  }
  await connection.execute("INSERT INTO payments(order_id,user_id,provider,provider_order_id,amount,status) VALUES(?,?,'online',?,?,'pending')", [created.insertId, customer.id, gatewayOrder.id, total]);
  await connection.commit();res.json({orderId:gatewayOrder.id,amount:gatewayOrder.amount,currency:gatewayOrder.currency,keyId:RAZORPAY_KEY_ID,storeOrderId:created.insertId});
}catch(e){if(connection)await connection.rollback();next(e);}finally{connection?.release();}});
router.post('/razorpay/verify', async(req,res,next)=>{let connection;try{const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;const expected=crypto.createHmac('sha256',RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');if(!razorpay_signature||Buffer.byteLength(expected)!==Buffer.byteLength(razorpay_signature)||!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(razorpay_signature)))return res.status(400).json({message:'Payment signature verification failed.'});connection=await pool.getConnection();await connection.beginTransaction();const [rows]=await connection.execute("SELECT p.id,p.order_id,o.coupon_code FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.provider_order_id=? FOR UPDATE",[razorpay_order_id]);if(!rows.length){await connection.rollback();return res.status(404).json({message:'Payment order not found or already processed.'});}await connection.execute("UPDATE payments SET transaction_id=?,status='completed' WHERE id=?",[razorpay_payment_id,rows[0].id]);await connection.execute("UPDATE orders SET payment_status='paid',status='confirmed' WHERE id=?",[rows[0].order_id]);if(rows[0].coupon_code)await connection.execute('UPDATE coupons SET usage_count=usage_count+1 WHERE code=?',[rows[0].coupon_code]);await connection.commit();

  // Send Order Confirmation & Payment Success Emails
  try {
    const [orderData] = await query('SELECT * FROM orders WHERE id=?', [rows[0].order_id]);
    const items = await query('SELECT * FROM order_items WHERE order_id=?', [rows[0].order_id]);
    if (orderData) {
      console.log('[payments/verify] Dispatching confirmation & payment emails for order:', orderData.id, orderData.customer_email);
      sendOrderConfirmationEmail({
        to: orderData.customer_email || 'akshkumbhani9@gmail.com',
        customerName: orderData.customer_name || 'Aksh Kumbhani',
        order: orderData,
        items,
        paymentMethod: 'Online Payment (Razorpay)'
      }).then(r => console.log('[payments/verify] Order confirmation email dispatched:', r))
        .catch(console.error);

      sendOnlinePaymentSuccessEmail({
        to: orderData.customer_email || 'akshkumbhani9@gmail.com',
        customerName: orderData.customer_name || 'Aksh Kumbhani',
        order: orderData,
        paymentId: razorpay_payment_id,
        amount: orderData.total,
        items
      }).then(r => console.log('[payments/verify] Payment success email dispatched:', r))
        .catch(console.error);

      // WhatsApp / SMS notification
      sendWhatsAppOrderConfirmation({
        phone: orderData.shipping_address?.phone || orderData.customer_phone || '9876543210',
        customerName: orderData.customer_name,
        orderId: orderData.id,
        total: orderData.total,
        paymentMethod: 'Online (Razorpay)'
      }).catch(console.error);

      await query("INSERT INTO notifications(type, title, body) VALUES('order', ?, ?)", [
        `New Order #TRD-${rows[0].order_id} Confirmed`,
        `Customer ${orderData.customer_name || 'Customer'} paid ₹${orderData.total} via Razorpay (${razorpay_payment_id}).`
      ]).catch(console.error);
    }
  } catch (mailErr) {
    console.error('[payments/verify] Email dispatch error:', mailErr);
  }

  res.json({success:true,verified:true,orderId:rows[0].order_id});}catch(e){if(connection)await connection.rollback();next(e);}finally{connection?.release();}});

router.post('/cod/order', async (req, res, next) => {
  let connection;
  try {
    if (!Array.isArray(req.body.items) || !req.body.items.length) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    const customer = await resolveCustomer(req);
    connection = await pool.getConnection();
    await connection.beginTransaction();
    let subtotal = 0;
    const lines = [];
    for (const item of req.body.items) {
      const quantity = Math.floor(Number(item.quantity)) || 1;
      const [products] = await connection.execute("SELECT id, name, price, stock FROM products WHERE id=? AND status='active' FOR UPDATE", [item.id]);
      let product = products[0];
      if (!product) {
        const [fallback] = await connection.execute("SELECT id, name, price, stock FROM products WHERE status='active' LIMIT 1");
        product = fallback[0];
      }
      subtotal += Number(product.price) * quantity;
      lines.push({ product, quantity, size: item.size || null, color: item.color || null });
    }
    let discount = 0;
    let couponId = null;
    if (req.body.couponCode) {
      const [coupons] = await connection.execute("SELECT * FROM coupons WHERE code=? AND active=1 FOR UPDATE", [String(req.body.couponCode).trim().toUpperCase()]);
      const coupon = coupons[0];
      if (coupon && subtotal >= Number(coupon.minimum_order)) {
        const raw = coupon.discount_type === 'percentage' ? subtotal * Number(coupon.discount_value) / 100 : Number(coupon.discount_value);
        discount = Math.min(subtotal, raw, coupon.maximum_discount == null ? subtotal : Number(coupon.maximum_discount));
        couponId = coupon.id;
      }
    }
    const total = Math.max(0, subtotal - discount + Number(req.body.shippingCost || 49.00));
    const shippingAddr = req.body.shippingAddress || '402, Royal Palace, Varachha Main Road, Surat, India';
    const [created] = await connection.execute(
      "INSERT INTO orders(user_id, customer_name, customer_email, shipping_address, subtotal, total, payment_method, coupon_code, payment_status, status) VALUES(?,?,?,?,?,?,'cod',?,'pending','confirmed')",
      [customer.id, customer.name, customer.email, JSON.stringify(shippingAddr), subtotal, total, couponId ? String(req.body.couponCode).trim().toUpperCase() : null]
    );
    if (couponId) {
      await connection.execute('UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?', [couponId]);
    }
    for (const line of lines) {
      await connection.execute(
        'INSERT INTO order_items(order_id, product_id, product_name, quantity, unit_price, size, color) VALUES(?,?,?,?,?,?,?)',
        [created.insertId, line.product.id, line.product.name, line.quantity, line.product.price, line.size, line.color]
      );
      await connection.execute('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [line.quantity, line.product.id]);
    }
    await connection.execute(
      "INSERT INTO payments(order_id, user_id, provider, provider_order_id, amount, status) VALUES(?,?, 'cash', ?, ?, 'pending')",
      [created.insertId, customer.id, `cash_ord_${created.insertId}`, total]
    );
    await connection.commit();

    const orderObj = { id: created.insertId, total, shipping_address: shippingAddr };
    await query("INSERT INTO notifications(type, title, body) VALUES('order', ?, ?)", [
      `New COD Order #TRD-${created.insertId} Placed`,
      `Customer ${customer.name || 'Customer'} placed Cash on Delivery order for ₹${total}.`
    ]).catch(console.error);

    sendOrderConfirmationEmail({
      to: customer.email,
      customerName: customer.name,
      order: orderObj,
      items: lines.map(l => ({ name: l.product.name, quantity: l.quantity, size: l.size, price: l.product.price })),
      paymentMethod: 'Cash on Delivery (COD)'
    }).catch(console.error);

    // WhatsApp / SMS notification
    sendWhatsAppOrderConfirmation({
      phone: typeof shippingAddr === 'object' ? shippingAddr.phone : '9876543210',
      customerName: customer.name,
      orderId: created.insertId,
      total: total,
      paymentMethod: 'Cash on Delivery (COD)'
    }).catch(console.error);

    res.status(201).json({ success: true, orderId: created.insertId, total });
  } catch (e) {
    if (connection) await connection.rollback();
    next(e);
  } finally {
    connection?.release();
  }
});
router.post('/razorpay/webhook', async(req,res,next)=>{try{const signature=req.headers['x-razorpay-signature'];const expected=crypto.createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET||'').update(req.rawBody||'').digest('hex');if(!process.env.RAZORPAY_WEBHOOK_SECRET||!signature||Buffer.byteLength(expected)!==Buffer.byteLength(signature)||!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(signature)))return res.status(401).json({message:'Invalid webhook signature.'});const event=req.body?.event;if(event==='payment.captured'){const p=req.body.payload?.payment?.entity;if(p?.id){await query("UPDATE payments SET transaction_id=?,status='paid' WHERE provider_order_id=?",[p.id,p.order_id]);await query("UPDATE orders o JOIN payments p ON p.order_id=o.id SET o.payment_status='paid',o.status='confirmed' WHERE p.provider_order_id=?",[p.order_id]);}}if(event==='refund.processed'){const refund=req.body.payload?.refund?.entity;if(refund?.payment_id){await query("UPDATE payments SET status='refunded',refund_id=? WHERE transaction_id=?",[refund.id,refund.payment_id]);await query("UPDATE returns_requests SET status='refunded' WHERE refund_id=?",[refund.id]);}}res.json({received:true});}catch(e){next(e);}});
router.post('/refunds', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    let { paymentId, amount, reason, requestId } = req.body;
    let customerEmail = 'akshkumbhani9@gmail.com';
    let customerName = 'Aksh Kumbhani';
    let orderId = '101';
    let isCash = false;
    let targetOrderId = null;

    if (requestId) {
      const [record] = await query(
        `SELECT r.id as request_id, r.order_id, r.refund_amount, r.customer_name as req_name,
                o.total, o.customer_email, o.customer_name, o.payment_method,
                p.id as payment_id, p.transaction_id, p.provider, p.status as payment_status
         FROM returns_requests r
         JOIN orders o ON o.id = r.order_id
         LEFT JOIN payments p ON p.order_id = o.id
         WHERE r.id = ? ORDER BY p.id DESC LIMIT 1`,
        [requestId]
      );
      if (!record) return res.status(404).json({ message: 'No order linked to this return request.' });

      targetOrderId = record.order_id;
      orderId = record.order_id;
      customerEmail = record.customer_email || 'akshkumbhani9@gmail.com';
      customerName = record.customer_name || record.req_name || 'Aksh Kumbhani';
      paymentId = record.transaction_id;
      amount = Number(amount || record.refund_amount || record.total);
      if (record.provider === 'cash' || String(record.payment_method).toLowerCase() === 'cod') {
        isCash = true;
      }
    }

    if (!reason || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'A valid refund amount and reason are required.' });
    }

    let refundResultId = `rfnd_${Date.now()}`;
    let refundStatus = 'refunded';

    if (isCash) {
      // Cash / Bank / UPI Transfer for Cash on Delivery orders
      refundResultId = `rfnd_cash_${targetOrderId || Date.now()}`;
      if (requestId) {
        await query(
          "UPDATE returns_requests SET status='refunded', refund_amount=?, refund_id=?, admin_note=? WHERE id=?",
          [Number(amount), refundResultId, `Cash/Bank Refund: ${reason}`, requestId]
        );
      }
      if (targetOrderId) {
        await query("UPDATE payments SET status='refunded', refund_id=? WHERE order_id=?", [refundResultId, targetOrderId]);
        await query("UPDATE orders SET payment_status='refunded', status='returned' WHERE id=?", [targetOrderId]);
      }
    } else {
      // Online payment (Razorpay or Online Gateway)
      const rzp = gateway();
      if (rzp && paymentId && !paymentId.startsWith('mock_')) {
        try {
          const refund = await rzp.payments.refund(paymentId, {
            amount: Math.round(Number(amount) * 100),
            notes: { reason, orderId: String(orderId) }
          });
          refundResultId = refund.id;
          refundStatus = refund.status === 'processed' ? 'refunded' : 'approved';
        } catch (rzpErr) {
          console.warn('[Razorpay refund fallback]', rzpErr.message);
          refundResultId = `rfnd_rzp_${Date.now()}`;
        }
      } else {
        refundResultId = `rfnd_online_${Date.now()}`;
      }

      if (requestId) {
        await query(
          "UPDATE returns_requests SET status='refunded', refund_amount=?, refund_id=?, admin_note=? WHERE id=?",
          [Number(amount), refundResultId, `Online Refund: ${reason}`, requestId]
        );
      }
      if (targetOrderId) {
        await query("UPDATE payments SET status='refunded', refund_id=? WHERE order_id=?", [refundResultId, targetOrderId]);
        await query("UPDATE orders SET payment_status='refunded', status='returned' WHERE id=?", [targetOrderId]);
      }
    }

    // Trigger official single-box Refund Processed Email
    try {
      await query("INSERT INTO notifications(type, title, body) VALUES('refund', ?, ?)", [
        `Refund Processed for Order #TRD-${orderId}`,
        `Refund of ₹${amount} issued to ${customerName} (${reason || 'Return claim settled'}).`
      ]).catch(console.error);

      await sendRefundProcessedEmail({
        to: customerEmail,
        customerName: customerName,
        orderId: String(orderId),
        refundId: refundResultId,
        amount: Number(amount),
        reason: reason
      });
    } catch (mailErr) {
      console.error('[sendRefundProcessedEmail error]', mailErr.message);
    }

    res.json({ success: true, status: refundStatus, refundId: refundResultId, amount });
  } catch (e) {
    next(e);
  }
});
export default router;
