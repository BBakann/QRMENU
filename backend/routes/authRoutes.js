import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { authRateLimit } from '../middlewares/rateLimit.js';
import { validateLogin, validatePasswordChange, preventNoSQLInjection, validateInputTypes } from '../middlewares/validation.js';
import {
    adminLogin,
    getAdminProfile,
    verifyToken,
    changePassword,
    adminLogout
} from '../controllers/authController.js';

const router = express.Router();

// PUBLIC ROUTES - CSRF KALDIRILDI, BASİT VERSİYON

router.post('/login', 
  authRateLimit,           // Rate limiting
  preventNoSQLInjection,   // NoSQL injection koruması
  validateInputTypes,      // Type validation
  validateLogin,           // Input validation
  adminLogin               // Login handler
);

// ADMIN ROUTES
router.get('/profile', requireAdmin, getAdminProfile);
router.get('/verify', requireAdmin, verifyToken);
router.post('/change-password', requireAdmin, validatePasswordChange, changePassword);
router.post('/logout', requireAdmin, adminLogout);

export default router; 