import { Router } from 'express';
import { query } from '../src/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  sendOrderConfirmationEmail,
  sendCodCashCollectedEmail,
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
  sendOutForDeliveryEmail,
  sendOrderCancelledEmail,
  sendRefundProcessedEmail,
} from '../services/emailService.js';
const router = Router();
const resources = {
  products: { table: 'products', fields: ['name','description','category','price','original_price','stock','sku','sizes','colors','status','featured','image_url'], required: ['name','price'] },
  categories: { table: 'categories', fields: ['name','description','image_url','status'], required: ['name'] },
  orders: { table: 'orders', fields: ['status','payment_status'], required: [] },
  customers: { table: 'users', fields: [], required: [] },
  inventory: { table: 'products', fields: ['stock'], required: ['stock'] },
  coupons: { table: 'coupons', fields: ['code','discount_type','discount_value','minimum_order','maximum_discount','starts_at','expires_at','usage_limit','active'], required: ['code','discount_value'] },
  banners: { table: 'banners', fields: ['title','subtitle','image_url','button_text','redirect_url','position','active'], required: ['title'] },
  payments: { table: 'payments', fields: [], required: [] },
  returns: { table: 'returns_requests', fields: ['status','refund_amount','admin_note'], required: [] },
  reviews: { table: 'reviews', fields: ['status'], required: [] },
  notifications: { table: 'notifications', fields: ['type','title','body','read_at'], required: ['title'] },
  settings: { table: 'store_settings', fields: ['value'], required: ['value'] },
  reports: { table: 'orders', fields: [], required: [] }
};
const getRoute = (name) => {
  const def = resources[name]; if (!def) return null;
  const r = Router(); r.use(requireAuth, requireAdmin);
  if (name === 'customers') r.get('/', async (_req,res,next) => { try { res.json(await query('SELECT id, name, email, phone, address, city, state, country, postal_code, role, active, created_at FROM users WHERE role=\'customer\' ORDER BY created_at DESC')); } catch(e){next(e);} });
  else if (name === 'reports') r.get('/', async (_req,res,next) => { try { const rows = await query('SELECT DATE(created_at) date,COUNT(*) orders_count,SUM(total) revenue FROM orders WHERE created_at>=DATE_SUB(CURDATE(),INTERVAL 12 MONTH) GROUP BY DATE(created_at) ORDER BY date DESC'); res.json(rows); } catch(e){next(e);} });
  else if (name === 'payments') {
    r.get('/', async (_req, res, next) => {
      try {
        const ordersWithoutPayment = await query(`
          SELECT o.id, o.user_id, o.payment_method, o.total, o.payment_status, o.status, o.created_at
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          WHERE p.id IS NULL
        `);
        for (const ord of ordersWithoutPayment) {
          const prov = String(ord.payment_method).toLowerCase().includes('cod') || String(ord.payment_method).toLowerCase().includes('cash') ? 'cash' : 'online';
          const st = (ord.payment_status === 'paid' || ord.status === 'delivered') ? 'completed' : 'pending';
          await query(
            "INSERT INTO payments(order_id, user_id, provider, provider_order_id, amount, status, created_at) VALUES(?,?,?,?,?,?,?)",
            [ord.id, ord.user_id || 1, prov, `${prov}_ord_${ord.id}`, ord.total, st, ord.created_at || new Date()]
          );
        }
        const rows = await query('SELECT * FROM payments ORDER BY created_at DESC, id DESC');
        res.json(rows);
      } catch (e) { next(e); }
    });
  }
  else if (name === 'settings') {
    r.get('/', async (_req,res,next) => { try { res.json(await query('SELECT setting_key, value FROM store_settings')); } catch(e){next(e);} });
    r.post('/', async (req,res,next) => { try { const { key, value } = req.body; await query('INSERT INTO store_settings(setting_key,value) VALUES(?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)',[key,String(value)]); res.json({ok:true}); } catch(e){next(e);} });
  } else {
    r.get('/', async (_req,res,next) => { try { const order = ['orders','payments','returns_requests','reviews','notifications'].includes(def.table) ? 'created_at DESC' : 'id DESC'; res.json(await query(`SELECT * FROM ${def.table} ORDER BY ${order}`)); } catch(e){next(e);} });
    if(name==='orders') r.get('/:id',async(req,res,next)=>{try{const [orders]=await query('SELECT * FROM orders WHERE id=?',[req.params.id]);if(!orders.length)return res.status(404).json({message:'Order not found.'});orders[0].items=await query('SELECT * FROM order_items WHERE order_id=?',[req.params.id]);res.json(orders[0]);}catch(e){next(e);}});
    r.post('/', async (req,res,next) => { try {
      const entries = Object.entries(req.body).filter(([key]) => def.fields.includes(key));
      for(const key of def.required) if(!req.body[key]) return res.status(400).json({message:`${key} is required.`});
      if(name === 'coupons') { const duplicate=await query('SELECT id FROM coupons WHERE code=?',[req.body.code.toUpperCase()]); if(duplicate.length) return res.status(409).json({message:'That coupon code already exists.'}); }
      if(!entries.length) return res.status(400).json({message:'No supported fields were provided.'});
      const sql=`INSERT INTO ${def.table} (${entries.map(([k])=>k).join(',')}) VALUES (${entries.map(()=>'?').join(',')})`;
      const result=await query(sql,entries.map(([k,v])=>['sizes','colors'].includes(k)&&typeof v==='string'?JSON.stringify(v.split(',').map(x=>x.trim()).filter(Boolean)):v)); res.status(201).json({id:result.insertId});
    } catch(e){next(e);} });
    r.patch('/:id', async (req,res,next) => { try {
      const entries=Object.entries(req.body).filter(([key])=>def.fields.includes(key));
      if(!entries.length)return res.status(400).json({message:'No supported fields were provided.'});
      if(name==='orders'&&req.body.status&&!['pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','returned'].includes(req.body.status))return res.status(400).json({message:'Invalid order status.'});
      if(name==='returns'&&req.body.status&&!['pending','approved','rejected','refunded'].includes(req.body.status))return res.status(400).json({message:'Invalid return status.'});

      let prevOrder = null;
      if (name === 'orders') {
        const [ord] = await query('SELECT * FROM orders WHERE id=?', [req.params.id]);
        prevOrder = ord || null;
      }

      await query(`UPDATE ${def.table} SET ${entries.map(([k])=>`${k}=?`).join(',')} WHERE id=?`,[...entries.map(([k,v])=>['sizes','colors'].includes(k)&&typeof v==='string'?JSON.stringify(v.split(',').map(x=>x.trim()).filter(Boolean)):v),req.params.id]);

      // Automatic Order & Delivery Email Triggering (Hospital Project Style)
      if (name === 'orders' && prevOrder) {
        try {
          const items = await query('SELECT * FROM order_items WHERE order_id=?', [req.params.id]);
          const newStatus = req.body.status || prevOrder.status;
          const newPaymentStatus = req.body.payment_status || prevOrder.payment_status;

          // When delivery completed or cash collected on COD
          if (newStatus === 'delivered' && prevOrder.status !== 'delivered') {
            if (String(prevOrder.payment_method).toLowerCase() === 'cod') {
              // Mark payment_status paid upon cash collection by delivery agent
              await query("UPDATE orders SET payment_status='paid' WHERE id=?", [req.params.id]);
              await query("UPDATE payments SET status='completed' WHERE order_id=?", [req.params.id]);
              sendCodCashCollectedEmail({
                to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
                customerName: prevOrder.customer_name || 'Aksh Kumbhani',
                order: { ...prevOrder, status: 'delivered', payment_status: 'paid' },
                collectedAmount: prevOrder.total,
                items,
              }).catch(console.error);
            }
            sendOrderDeliveredEmail({
              to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
              customerName: prevOrder.customer_name || 'Aksh Kumbhani',
              order: { ...prevOrder, status: 'delivered' },
              items,
            }).catch(console.error);
          } else if (newStatus === 'shipped' && prevOrder.status !== 'shipped') {
            sendOrderShippedEmail({
              to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
              customerName: prevOrder.customer_name || 'Aksh Kumbhani',
              order: { ...prevOrder, status: 'shipped' },
            }).catch(console.error);
          } else if (newStatus === 'out_for_delivery' && prevOrder.status !== 'out_for_delivery') {
            sendOutForDeliveryEmail({
              to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
              customerName: prevOrder.customer_name || 'Aksh Kumbhani',
              order: { ...prevOrder, status: 'out_for_delivery' },
            }).catch(console.error);
          } else if (newStatus === 'cancelled' && prevOrder.status !== 'cancelled') {
            sendOrderCancelledEmail({
              to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
              customerName: prevOrder.customer_name || 'Aksh Kumbhani',
              order: { ...prevOrder, status: 'cancelled' },
              reason: req.body.admin_note || 'Order cancelled via Store Desk',
            }).catch(console.error);
          } else if (newStatus === 'confirmed' && prevOrder.status === 'pending') {
            sendOrderConfirmationEmail({
              to: prevOrder.customer_email || 'akshkumbhani9@gmail.com',
              customerName: prevOrder.customer_name || 'Aksh Kumbhani',
              order: prevOrder,
              items,
              paymentMethod: prevOrder.payment_method || 'Online Payment',
            }).catch(console.error);
          }
        } catch (mailErr) {
          console.error('[store/orders patch] Email error:', mailErr);
        }
      }

      res.json({ok:true});
    }catch(e){next(e);} });
    r.delete('/:id', async (req,res,next) => { try { if(name==='categories'){const used=await query('SELECT id FROM products WHERE category=(SELECT name FROM categories WHERE id=?) LIMIT 1',[req.params.id]);if(used.length)return res.status(409).json({message:'Move or update the category products before deleting this category.'});} await query(`DELETE FROM ${def.table} WHERE id=?`,[req.params.id]);res.json({ok:true});}catch(e){next(e);} });
  }
  return r;
};
for(const name of Object.keys(resources)) router.use(`/${name}`,getRoute(name));
router.get('/store/products', async (_req,res,next)=>{try{res.json(await query("SELECT id,name,description,category,price,original_price,stock,image_url FROM products WHERE status='active' ORDER BY featured DESC,id DESC"));}catch(e){next(e);}});
router.get('/store/product-status', async (_req,res,next)=>{try{res.json(await query("SELECT id,name,image_url,status,stock FROM products"));}catch(e){next(e);}});
router.get('/store/categories', async (_req,res,next)=>{try{res.json(await query("SELECT * FROM categories WHERE status='active' ORDER BY name"));}catch(e){next(e);}});
router.get('/store/banners', async (_req,res,next)=>{try{res.json(await query("SELECT * FROM banners WHERE active=1 ORDER BY position ASC, id DESC"));}catch(e){next(e);}});
router.post('/store/coupons/validate', async(req,res,next)=>{try{const code=String(req.body.code||'').trim().toUpperCase();const subtotal=Number(req.body.subtotal);if(!code||!Number.isFinite(subtotal)||subtotal<0)return res.status(400).json({message:'Enter a coupon and a valid subtotal.'});const [coupon]=await query("SELECT * FROM coupons WHERE code=? AND active=1 AND (starts_at IS NULL OR starts_at<=NOW()) AND (expires_at IS NULL OR expires_at>=NOW()) AND (usage_limit IS NULL OR usage_count<usage_limit)",[code]);if(!coupon)return res.status(404).json({message:'This coupon is invalid or expired.'});if(subtotal<Number(coupon.minimum_order))return res.status(400).json({message:`Minimum order is ₹${coupon.minimum_order}.`});const raw=coupon.discount_type==='percentage'?subtotal*Number(coupon.discount_value)/100:Number(coupon.discount_value);const discount=Math.min(subtotal,raw,coupon.maximum_discount==null?subtotal:Number(coupon.maximum_discount));res.json({code,discount,discountType:coupon.discount_type});}catch(e){next(e);}});

router.get('/store/orders/track', async (req, res, next) => {
  try {
    const { id, email } = req.query;
    if (!id || !email) return res.status(400).json({ message: 'Order ID and email are required.' });
    const cleanId = String(id).replace(/^[^\d]+/i, '').trim();
    const [order] = await query('SELECT * FROM orders WHERE id=? AND LOWER(customer_email)=? LIMIT 1', [cleanId, String(email).toLowerCase().trim()]);
    if (!order) return res.status(404).json({ message: 'Order not found. Please verify Order ID and email.' });
    const items = await query('SELECT * FROM order_items WHERE order_id=?', [order.id]);
    res.json({ ...order, items });
  } catch (e) {
    next(e);
  }
});

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });
    await query("INSERT INTO notifications(type, title, body) VALUES('contact', ?, ?)", [
      `New Contact Message from ${name}`,
      `Subject: ${subject || 'No subject'} | Phone: ${phone || 'N/A'} | Email: ${email} | Msg: ${message || ''}`
    ]).catch(console.error);
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (e) {
    next(e);
  }
});

router.post('/subscribe', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid email is required.' });
    await query("INSERT INTO notifications(type, title, body) VALUES('system', ?, ?)", [
      'New Newsletter Subscriber',
      `Email: ${email} joined the newsletter subscriber list.`
    ]).catch(console.error);
    res.json({ success: true, message: 'Subscribed successfully.' });
  } catch (e) {
    next(e);
  }
});

// Shiprocket / Courier Dispatch Action
router.post('/orders/:id/ship', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { courierName } = req.body;
    const { shipOrderWithCourier } = await import('../services/courierService.js');
    const result = await shipOrderWithCourier(orderId, courierName || 'Shiprocket Express');
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// Public Customer Reviews API
router.get('/store/reviews', async (req, res, next) => {
  try {
    const productId = req.query.productId;
    let sql = "SELECT id, product_id, customer_name, product_name, rating, description, created_at FROM reviews WHERE status = 'published'";
    const params = [];
    if (productId) {
      sql += ' AND product_id = ?';
      params.push(productId);
    }
    sql += ' ORDER BY id DESC LIMIT 50';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.post('/store/reviews', async (req, res, next) => {
  try {
    const { productId, customerName, productName, rating, description } = req.body;
    if (!customerName || !rating || !description) {
      return res.status(400).json({ message: 'Name, rating, and description are required.' });
    }
    const rateNum = Math.min(5, Math.max(1, Number(rating) || 5));
    const result = await query(
      "INSERT INTO reviews(product_id, customer_name, product_name, rating, description, status) VALUES(?, ?, ?, ?, ?, 'published')",
      [productId || null, customerName.trim(), productName || 'Torado Apparel', rateNum, description.trim()]
    );

    // Notify admin
    await query("INSERT INTO notifications(type, title, body) VALUES('system', ?, ?)", [
      `New ★★★★★ Review by ${customerName}`,
      `Rated ${rateNum}/5 stars: "${description.slice(0, 80)}..."`
    ]).catch(console.error);

    res.status(201).json({ success: true, id: result.insertId });
  } catch (e) {
    next(e);
  }
});

export default router;
