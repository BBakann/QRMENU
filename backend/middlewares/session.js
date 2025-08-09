// Session Hijacking Protection
export const sessionProtection = (req, res, next) => {
  // User-Agent kontrolü
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz istek'
    });
  }

  // Referer kontrolü (CSRF için ek koruma) - TEST İÇİN GEÇİCİ DEVRE DIŞI
  const referer = req.headers.referer;
  if (false && req.method === 'POST' && !referer) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz istek kaynağı'
    });
  }

  // Origin kontrolü
  const origin = req.headers.origin;
  if (origin && !req.headers.host.includes(new URL(origin).hostname)) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz origin'
    });
  }

  next();
}; 