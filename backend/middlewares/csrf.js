// CSRF Protection Middleware
export const csrfProtection = (req, res, next) => {
  // GET istekleri için CSRF kontrolü yapma
  if (req.method === 'GET') {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'];
  
  if (!csrfToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token eksik'
    });
  }

  // Basit token validation (production'da daha güçlü olmalı)
  if (csrfToken.length < 20) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz CSRF token'
    });
  }

  next();
}; 