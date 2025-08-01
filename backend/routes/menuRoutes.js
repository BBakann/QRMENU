import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { adminRateLimit } from '../middlewares/rateLimit.js';
import { validateProduct } from '../middlewares/validation.js';
import {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsForAdmin
} from '../controllers/menuController.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// ADMIN ROUTES
router.get('/admin/all', requireAdmin, adminRateLimit, getAllProductsForAdmin);
router.post('/', requireAdmin, adminRateLimit, validateProduct, createProduct);
router.put('/:id', requireAdmin, adminRateLimit, validateProduct, updateProduct);
router.delete('/:id', requireAdmin, adminRateLimit, deleteProduct);

export default router; 