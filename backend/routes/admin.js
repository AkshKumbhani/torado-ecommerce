import { Router } from 'express';
import { query } from '../src/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/summary', async (req, res, next) => {
  try {
    const [[p]] = await Promise.all([query('SELECT COUNT(*) totalProducts, COALESCE(SUM(stock),0) totalStock, SUM(stock<=5) lowStockCount FROM products WHERE status=\'active\'')]);
    const [[o]] = await Promise.all([query('SELECT COUNT(*) totalOrders, COALESCE(SUM(CASE WHEN payment_status=\'paid\' THEN total ELSE 0 END),0) totalRevenue, SUM(status IN (\'pending\',\'confirmed\')) pendingOrders FROM orders')]);
    const [[c]] = await Promise.all([query('SELECT COUNT(*) totalCustomers FROM users WHERE role=\'customer\'')]);
    const recentOrders = await query('SELECT id,customer_name,total,status FROM orders ORDER BY created_at DESC LIMIT 5');
    const [[w]] = await Promise.all([query('SELECT COALESCE(SUM(total),0) weeklyRevenue FROM orders WHERE payment_status=\'paid\' AND created_at>=DATE_SUB(NOW(),INTERVAL 7 DAY)')]);
    const [[today]] = await Promise.all([query("SELECT COALESCE(SUM(total),0) todayRevenue FROM orders WHERE payment_status='paid' AND DATE(created_at)=CURDATE()")]);
    const weeklySales = await query("SELECT DATE(created_at) date, COALESCE(SUM(total),0) revenue FROM orders WHERE payment_status='paid' AND created_at>=DATE_SUB(CURDATE(),INTERVAL 6 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [[r]] = await Promise.all([query('SELECT COUNT(*) pendingReturns FROM returns_requests WHERE status=\'pending\'')]);
    const [[n]] = await Promise.all([query('SELECT COUNT(*) unreadNotificationsCount FROM notifications WHERE read_at IS NULL')]);
    const [adminUser] = await query('SELECT id,name,email,phone,address,city,state,country,postal_code,role FROM users WHERE id=?', [req.user?.id]);
    res.json({ ...p, ...o, ...c, ...w, ...today, ...r, ...n, recentOrders, weeklySales, adminUser: adminUser || null });
  } catch (e) { next(e); }
});
router.get('/profile', async (req, res, next) => {
  try { const [user] = await query('SELECT id,name,email,phone,address,city,state,country,postal_code,role,created_at FROM users WHERE id=?', [req.user.id]); res.json(user ? [user] : []); } catch (e) { next(e); }
});
router.patch('/profile/:id?', async (req, res, next) => {
  try {
    const targetId = req.params.id || req.user.id;
    const { name, email, phone, address, city, state, country, postal_code, password } = req.body;
    const updates = [];
    const params = [];
    if (name) { updates.push('name=?'); params.push(name); }
    if (email) { updates.push('email=?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone=?'); params.push(phone); }
    if (address !== undefined) { updates.push('address=?'); params.push(address); }
    if (city !== undefined) { updates.push('city=?'); params.push(city); }
    if (state !== undefined) { updates.push('state=?'); params.push(state); }
    if (country !== undefined) { updates.push('country=?'); params.push(country); }
    if (postal_code !== undefined) { updates.push('postal_code=?'); params.push(postal_code); }
    if (password && password.trim()) {
      const bcrypt = (await import('bcryptjs')).default;
      const hashed = await bcrypt.hash(password.trim(), 10);
      updates.push('password=?');
      params.push(hashed);
    }
    if (updates.length) {
      params.push(targetId);
      await query(`UPDATE users SET ${updates.join(', ')} WHERE id=?`, params);
    }
    const [user] = await query('SELECT id,name,email,phone,address,city,state,country,postal_code,role,created_at FROM users WHERE id=?', [targetId]);
    res.json({ message: 'Profile updated successfully', user });
  } catch (e) { next(e); }
});
export default router;
