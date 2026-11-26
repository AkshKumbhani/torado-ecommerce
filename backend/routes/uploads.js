import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const directory = fileURLToPath(new URL('../uploads/products/', import.meta.url));
mkdirSync(directory, { recursive: true });
const storage = multer.diskStorage({ destination: directory, filename: (_req,file,cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req,file,cb) => cb(null, ['image/jpeg','image/png','image/webp','image/avif'].includes(file.mimetype)) });
const router = Router();
router.post('/products', requireAuth, requireAdmin, upload.single('image'), (req,res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose a JPG, PNG, WEBP, or AVIF image under 5 MB.' });
  res.status(201).json({ image_url: `${process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3000}`}/uploads/products/${req.file.filename}` });
});
export const productUploadDirectory = directory;
export default router;
