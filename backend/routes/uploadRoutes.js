import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { uploadRateLimit } from '../middlewares/rateLimit.js';
import {
    uploadMiddleware,
    uploadImage,
    deleteImage
} from '../controllers/uploadController.js';

const router = express.Router();

// ADMIN ROUTES
router.post('/', requireAdmin, uploadRateLimit, uploadMiddleware, uploadImage);
router.delete('/:public_id', requireAdmin, uploadRateLimit, deleteImage);

export default router; 