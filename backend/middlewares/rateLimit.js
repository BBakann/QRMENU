import rateLimit from 'express-rate-limit';

// Genel rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum 100 istek
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoint'leri için daha sıkı rate limiting
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // IP başına maksimum 5 login denemesi
  message: {
    success: false,
    message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload endpoint'leri için rate limiting
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 10, // IP başına maksimum 10 upload
  message: {
    success: false,
    message: 'Çok fazla dosya yükleme denemesi. Lütfen 1 saat sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin endpoint'leri için rate limiting
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 50, // IP başına maksimum 50 admin isteği
  message: {
    success: false,
    message: 'Çok fazla admin isteği. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 