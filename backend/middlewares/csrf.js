// backend/middlewares/csrf.js - TAM ÇÖZÜM

import crypto from 'crypto';

// CSRF token store (production'da Redis kullan)
const csrfTokens = new Map();

// CSRF token oluştur
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF token endpoint'i - GÜÇLÜ VERSİYON
export const getCsrfToken = (req, res) => {
  const token = generateCSRFToken();
  const sessionId = req.sessionID || req.ip;
  
  // Token'ı store'a kaydet (1 saat geçerli)
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 3600000, // 1 saat
    createdAt: Date.now(),
    ip: req.ip
  });
  
  res.json({ 
    success: true,
    csrfToken: token 
  });
};

// CSRF Protection Middleware - TAM GÜVENLİ VERSİYON
export const csrfProtection = (req, res, next) => {
  // GET, HEAD, OPTIONS istekleri için CSRF kontrolü yapma
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'];
  
  if (!csrfToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token eksik'
    });
  }

  // 1. Token hex format kontrolü (64 karakter hex)
  if (!/^[a-f0-9]{64}$/i.test(csrfToken)) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz CSRF token formatı'
    });
  }

  // 2. Stored token kontrolü
  const sessionId = req.sessionID || req.ip;
  const storedToken = csrfTokens.get(sessionId);
  
  if (!storedToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF session bulunamadı'
    });
  }

  // 3. Token süresini kontrol et
  if (Date.now() > storedToken.expires) {
    csrfTokens.delete(sessionId);
    return res.status(403).json({
      success: false,
      message: 'CSRF token süresi dolmuş'
    });
  }

  // 4. Timing-safe karşılaştırma
  if (!crypto.timingSafeEqual(Buffer.from(csrfToken), Buffer.from(storedToken.token))) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token eşleşmiyor'
    });
  }

  next();
}; 