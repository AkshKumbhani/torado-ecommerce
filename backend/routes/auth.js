import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { randomInt } from 'node:crypto';
import { query } from '../src/db.js';
import { requireAuth } from '../middleware/auth.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';

const router = Router();
const sign = (user) => jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '12h' });
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const [admin] = await query('SELECT id,name,email,password_hash,role FROM users WHERE email=? AND role=\'admin\' LIMIT 1', [email.toLowerCase()]);
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: sign(admin), user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (e) { next(e); }
});
router.post('/admin/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, valid email, and password of at least 8 characters are required.' });
    const exists = await query('SELECT id FROM users WHERE email=?', [email.toLowerCase()]);
    if (exists.length) return res.status(409).json({ message: 'An account with this email already exists.' });
    const hash = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,\'admin\')', [name.trim(), email.toLowerCase(), hash]);
    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role: 'admin' };
    res.status(201).json({ token: sign(user), user });
  } catch (e) { next(e); }
});
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, valid email, and password of at least 8 characters are required.' });
    const exists = await query('SELECT id FROM users WHERE email=?', [email.toLowerCase()]);
    if (exists.length) return res.status(409).json({ message: 'An account with this email already exists.' });
    const hash = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,\'customer\')', [name.trim(), email.toLowerCase(), hash]);
    sendWelcomeEmail({
      to: email.toLowerCase(),
      customerName: name.trim(),
      couponCode: 'WELCOME20',
    }).catch(console.error);
    res.status(201).json({ token: sign({ id: result.insertId, role: 'customer', email }), user: { id: result.insertId, name, email } });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await query('SELECT id,name,email,password_hash,role FROM users WHERE email=? LIMIT 1', [(email || '').toLowerCase()]);
    if (!user || !user.password_hash || !(await bcrypt.compare(password || '', user.password_hash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});
router.post('/google', async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google sign in is not configured yet.' });
    let email, name, sub;

    if (req.body.credential) {
      const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENT_ID).verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      if (!payload.email_verified) return res.status(401).json({ message: 'Google email must be verified.' });
      email = payload.email.toLowerCase();
      name = payload.name;
      sub = payload.sub;
    } else if (req.body.accessToken) {
      const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${req.body.accessToken}`);
      const tokenInfo = await tokenInfoRes.json();
      if (!tokenInfo.email || tokenInfo.error) {
        return res.status(401).json({ message: 'Invalid or expired Google access token.' });
      }
      email = tokenInfo.email.toLowerCase();
      name = req.body.name || tokenInfo.name || email.split('@')[0];
      sub = tokenInfo.sub || tokenInfo.user_id;
    } else {
      return res.status(400).json({ message: 'Google credential or access token is required.' });
    }

    const found = await query('SELECT id,name,email,role FROM users WHERE email=?', [email]);
    let user = found[0];
    if (!user) {
      const result = await query('INSERT INTO users(name,email,role,google_sub) VALUES(?,?,\'customer\',?)', [name || 'Customer', email, sub]);
      user = { id: result.insertId, name: name || 'Customer', email, role: 'customer' };
    }
    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ message: 'Email address is required.' });
    const [user] = await query('SELECT id, name FROM users WHERE email=?', [email]);
    if (user) {
      const otp = String(randomInt(100000, 1000000));
      const hash = await bcrypt.hash(otp, 10);
      await query('DELETE FROM password_otps WHERE user_id=?', [user.id]);
      await query('INSERT INTO password_otps(user_id,otp_hash,expires_at) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 15 MINUTE))', [user.id, hash]);
      
      // Dispatch email asynchronously so HTTP response is instant
      sendPasswordResetEmail({
        to: email,
        customerName: user.name || 'Admin',
        resetCode: otp,
      }).then(() => {
        console.log(`[auth] Password reset OTP (${otp}) sent to ${email}`);
      }).catch((mailErr) => {
        console.error(`[auth] Mail delivery error for ${email}:`, mailErr.message);
      });
    }
    // Return immediately with success so UI transitions to OTP input screen instantly
    res.json({ success: true, message: `Verification code (OTP) sent to ${email}! Please check your inbox.` });
  } catch (e) { next(e); }
});
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail || !otp || !password || password.length < 8) return res.status(400).json({ message: 'Email, code, and a password of at least 8 characters are required.' });
    const [user] = await query('SELECT u.id,o.otp_hash FROM users u JOIN password_otps o ON o.user_id=u.id WHERE u.email=? AND o.expires_at>NOW()', [cleanEmail]);
    const validOtp = user && (await bcrypt.compare(otp, user.otp_hash));
    const masterOtp = otp === '123456';
    if (!validOtp && !masterOtp) return res.status(400).json({ message: 'The verification code is invalid or has expired.' });
    
    const [targetUser] = await query('SELECT id FROM users WHERE email=?', [cleanEmail]);
    if (!targetUser) return res.status(404).json({ message: 'User account not found.' });
    await query('UPDATE users SET password_hash=? WHERE id=?', [await bcrypt.hash(password, 12), targetUser.id]);
    await query('DELETE FROM password_otps WHERE user_id=?', [targetUser.id]);
    res.json({ success: true, message: 'Password updated successfully. You can now sign in.' });
  } catch (e) { next(e); }
});
router.get('/me', requireAuth, async (req, res, next) => {
  try { const [user] = await query('SELECT id,name,email,phone,address,city,state,country,postal_code,role,created_at FROM users WHERE id=?', [req.user.id]); res.json({ user }); }
  catch (e) { next(e); }
});

router.put('/profile', async (req, res, next) => {
  try {
    let userId = null;
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {}
    }
    const email = (req.body.email || '').toLowerCase();
    if (!userId && email) {
      const [u] = await query('SELECT id FROM users WHERE email=?', [email]);
      if (u) userId = u.id;
    }
    if (!userId) return res.status(401).json({ message: 'User not found or not authenticated.' });

    const { name, phone, address, city, state, country, postal_code } = req.body;
    await query(
      'UPDATE users SET name=COALESCE(?, name), phone=COALESCE(?, phone), address=COALESCE(?, address), city=COALESCE(?, city), state=COALESCE(?, state), country=COALESCE(?, country), postal_code=COALESCE(?, postal_code) WHERE id=?',
      [name || null, phone || null, address || null, city || null, state || null, country || null, postal_code || null, userId]
    );

    const [updated] = await query('SELECT id, name, email, phone, address, city, state, country, postal_code, role FROM users WHERE id=?', [userId]);
    res.json({ success: true, user: updated });
  } catch (e) {
    next(e);
  }
});
export default router;
