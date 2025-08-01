import config from '../config/config.js';

// CORS ayarları - Development için basitleştirildi
export const getCorsOptions = () => {
    if (process.env.NODE_ENV === 'production') {
        return {
            origin: config.cors.allowedOrigins,
            credentials: true
        };
    } else {
        // Development için tüm localhost'lara izin ver
        return {
            origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
            credentials: true
        };
    }
};

// CORS middleware factory
export const createCorsMiddleware = (cors) => {
    return cors(getCorsOptions());
}; 