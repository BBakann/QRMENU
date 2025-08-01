import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { authRateLimit } from '../middlewares/rateLimit.js';
import { validateLogin, validatePasswordChange } from '../middlewares/validation.js';
import { csrfProtection } from '../middlewares/csrf.js';
import {
    adminLogin,
    getAdminProfile,
    verifyToken,
    changePassword,
    adminLogout
} from '../controllers/authController.js';

const router = express.Router();

// PUBLIC ROUTES
router.post('/login', authRateLimit, csrfProtection, validateLogin, adminLogin);

// ADMIN ROUTES
router.get('/profile', requireAdmin, getAdminProfile);
router.get('/verify', requireAdmin, verifyToken);
router.post('/change-password', requireAdmin, csrfProtection, validatePasswordChange, changePassword);
router.post('/logout', requireAdmin, csrfProtection, adminLogout);

export default router; 