import { authenticateAdmin } from '../utils/jwt.js';

// Admin authentication middleware
export const requireAdmin = authenticateAdmin;

// Optional admin authentication (for public routes that can also be accessed by admin)
export const optionalAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        authenticateAdmin(req, res, next);
    } else {
        next();
    }
};

// Rate limiting middleware (basit)
export const rateLimit = (req, res, next) => {
    // Basit rate limiting - production'da Redis kullanılabilir
    const clientIP = req.ip;
    const now = Date.now();
    
    // Bu basit bir implementasyon - gerçek projede Redis kullanın
    if (!req.app.locals.rateLimit) {
        req.app.locals.rateLimit = {};
    }
    
    if (!req.app.locals.rateLimit[clientIP]) {
        req.app.locals.rateLimit[clientIP] = {
            count: 0,
            resetTime: now + 60000 // 1 dakika
        };
    }
    
    const rateLimit = req.app.locals.rateLimit[clientIP];
    
    if (now > rateLimit.resetTime) {
        rateLimit.count = 0;
        rateLimit.resetTime = now + 60000;
    }
    
    rateLimit.count++;
    
    if (rateLimit.count > 100) { // 1 dakikada max 100 request
        return res.status(429).json({
            success: false,
            message: 'Çok fazla istek gönderildi. Lütfen bekleyin.'
        });
    }
    
    next();
}; 