import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();
import { pool, query } from './src/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/store.js';
import paymentRoutes from './routes/payments.js';
import uploadRoutes, { productUploadDirectory } from './routes/uploads.js';

const app = express();
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:3001').split(','), credentials: true }));
app.use(express.json({ limit: '2mb', verify: (req, _res, buffer) => { req.rawBody = Buffer.from(buffer); } }));
app.use('/uploads/products', express.static(productUploadDirectory, { fallthrough: false, maxAge: '7d' }));
app.get('/api/health', async (_req, res) => {
  try { await query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'unavailable' }); }
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', storeRoutes);
app.use('/api/uploads', uploadRoutes);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.expose ? err.message : 'Something went wrong. Please try again.' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Torado API listening on port ${port}`));
process.on('SIGINT', async () => { await pool.end(); process.exit(0); });
