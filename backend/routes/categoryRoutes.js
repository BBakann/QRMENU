import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { adminRateLimit } from '../middlewares/rateLimit.js';
import { validateCategory } from '../middlewares/validation.js';
import {
    getAllCategories,
    getAllCategoriesForAdmin,
    createCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllCategories);

// ADMIN ROUTES
router.get('/admin/all', requireAdmin, adminRateLimit, getAllCategoriesForAdmin);
router.post('/', requireAdmin, adminRateLimit, validateCategory, createCategory);
router.delete('/:id', requireAdmin, adminRateLimit, deleteCategory);

export default router; 