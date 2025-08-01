import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import { connectDatabase } from './db/index.js';
import { createCorsMiddleware } from './helpers/index.js';
import { securityHeaders, corsSecurity, requestSizeLimit } from './middlewares/security.js';
import { generalRateLimit } from './middlewares/rateLimit.js';
import { sessionProtection } from './middlewares/session.js';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const PORT = config.server.port;

// Database bağlantısı
connectDatabase();

// Security headers
app.use(securityHeaders);
app.use(corsSecurity);

// CORS ayarları
app.use(createCorsMiddleware(cors));

// Request size limiting
app.use(requestSizeLimit);

// General rate limiting
app.use(generalRateLimit);

// Session protection
app.use(sessionProtection);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// Test Route - Debug için
app.get('/', (req, res) => {
    res.json({ 
        message: "QRMenu Backend API çalışıyor! 🚀",
        environment: config.server.nodeEnv,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        cors: config.cors.allowedOrigins
    });
});

// Backend health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        uptime: process.uptime()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        ...(config.server.nodeEnv === 'development' && { error: err.message })
    });
});

// 404 handler - WILDCARD PROBLEMİNİ DÜZELTTİK
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı',
        path: req.originalUrl,
        method: req.method
    });
});

// Vercel için export 
export default app;

// Local development için
if (process.env.NODE_ENV !== 'production') {
  const PORT = config.server.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`🌍 Environment: ${config.server.nodeEnv}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🎯 Frontend URL: ${config.cors.frontendUrl}`);
    console.log('📋 Routes loaded: /api/admin, /api/menu, /api/categories, /api/upload');
    console.log('✅ Backend hazır!');
  });
}