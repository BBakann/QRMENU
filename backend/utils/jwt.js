import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Token oluştur
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    algorithm: 'HS256',
    issuer: 'qrmenu-api',
    audience: 'qrmenu-admin'
  });
};

// Token doğrula
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
      issuer: 'qrmenu-api',
      audience: 'qrmenu-admin'
    });
  } catch (error) {
    return null;
  }
};

// Admin middleware - token kontrolü (cookie'den)
export const authenticateAdmin = (req, res, next) => {
  // Önce cookie'den token'ı kontrol et
  let token = req.cookies?.adminToken;
  
  // Eğer cookie'de yoksa Authorization header'dan kontrol et (geriye uyumluluk için)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token gerekli!'
    });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Token geçersiz veya süresi dolmuş!'
    });
  }
  
  req.user = decoded;
  next();
};