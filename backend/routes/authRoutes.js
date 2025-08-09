import express from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { authRateLimit } from '../middlewares/rateLimit.js';
import { validateLogin, validatePasswordChange, preventNoSQLInjection, validateInputTypes } from '../middlewares/validation.js';
import { csrfProtection, getCsrfToken } from '../middlewares/csrf.js';
import {
    adminLogin,
    getAdminProfile,
    verifyToken,
    changePassword,
    adminLogout
} from '../controllers/authController.js';

const router = express.Router();

// PUBLIC ROUTES - GÜVENLİK KATMANLARI EKLENDİ

// CSRF token endpoint (ilk olarak token almak için)
router.get('/csrf-token', getCsrfToken);

router.post('/login', 
  authRateLimit,           // Rate limiting
  preventNoSQLInjection,   // NoSQL injection koruması
  validateInputTypes,      // Type validation
  validateLogin,           // Input validation
  csrfProtection,          // CSRF koruması
  adminLogin               // Login handler
);

// ADMIN ROUTES
router.get('/profile', requireAdmin, getAdminProfile);
router.get('/verify', requireAdmin, verifyToken);
router.post('/change-password', requireAdmin, csrfProtection, validatePasswordChange, changePassword);
router.post('/logout', requireAdmin, csrfProtection, adminLogout);

export default router; 