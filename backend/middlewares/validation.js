import { body, validationResult } from 'express-validator';

// NoSQL Injection koruması
export const preventNoSQLInjection = (req, res, next) => {
  const checkForInjection = (obj, path = '') => {
    if (obj === null || obj === undefined) return false;
    
    if (typeof obj === 'object') {
      // MongoDB operatörlerini tespit et
      const mongoOperators = ['$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex', '$where', '$exists', '$all'];
      
      for (const key in obj) {
        if (mongoOperators.includes(key)) {
          console.warn(`🚨 NoSQL injection attempt detected! Path: ${path}.${key}, Value:`, obj[key]);
          return true;
        }
        
        if (checkForInjection(obj[key], `${path}.${key}`)) {
          return true;
        }
      }
    }
    
    if (typeof obj === 'string') {
      // String içinde MongoDB operatörleri arama
      const suspiciousPatterns = [/\$ne/, /\$gt/, /\$lt/, /\$regex/, /\$where/];
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    }
    
    return false;
  };

  // Request body'yi kontrol et
  if (req.body && checkForInjection(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz istek formatı tespit edildi',
      error: 'SECURITY_VIOLATION'
    });
  }

  // Query parameters'ı kontrol et
  if (req.query && checkForInjection(req.query)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz query parametresi tespit edildi',
      error: 'SECURITY_VIOLATION'
    });
  }

  next();
};

// Input type validation
export const validateInputTypes = (req, res, next) => {
  const validateType = (obj, expectedTypes) => {
    for (const [key, expectedType] of Object.entries(expectedTypes)) {
      if (obj[key] !== undefined) {
        if (expectedType === 'string' && typeof obj[key] !== 'string') {
          return `${key} field must be a string`;
        }
        if (expectedType === 'number' && typeof obj[key] !== 'number') {
          return `${key} field must be a number`;
        }
        if (expectedType === 'boolean' && typeof obj[key] !== 'boolean') {
          return `${key} field must be a boolean`;
        }
      }
    }
    return null;
  };

  // Login endpoint için özel validation
  if (req.path === '/login' && req.method === 'POST') {
    const error = validateType(req.body, {
      username: 'string',
      password: 'string'
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
        error: 'TYPE_VALIDATION_ERROR'
      });
    }
  }

  next();
};

// Validation sonuçlarını kontrol eden middleware
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation hatası',
      errors: errors.array()
    });
  }
  next();
};

// Login validation
export const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter arasında olmalıdır')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  
  validateRequest
];

// Product validation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ürün adı 2-100 karakter arasında olmalıdır')
    .escape(),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Açıklama 10-500 karakter arasında olmalıdır')
    .escape(),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Fiyat geçerli bir sayı olmalıdır'),
  
  body('category')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Kategori 2-30 karakter arasında olmalıdır')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Kategori sadece küçük harf, rakam ve tire içerebilir'),
  
  validateRequest
];

// Category validation
export const validateCategory = [
  body('id')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Kategori ID 2-30 karakter arasında olmalıdır')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Kategori ID sadece küçük harf, rakam ve tire içerebilir'),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Kategori adı 2-50 karakter arasında olmalıdır')
    .escape(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Açıklama maksimum 200 karakter olabilir')
    .escape(),
  
  validateRequest
];

// Password change validation
export const validatePasswordChange = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Mevcut şifre en az 6 karakter olmalıdır'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Yeni şifre en az 8 karakter olmalıdır')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),
  
  validateRequest
]; 