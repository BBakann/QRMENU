import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Token oluştur
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Token doğrula
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

// Admin middleware - token kontrolü
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token gerekli!'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token formatı yanlış!'
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