import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

// Zorunlu environment variable'ları kontrol et
const requiredEnvVars = [
  'JWT_SECRET',
  'ADMIN_USERNAME', 
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH',
  'MONGODB_URI' 
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('💥 Kritik hata: Eksik environment variables!');
  console.error('📋 Eksik değerler:', missingEnvVars.join(', '));
  console.error('📄 .env dosyasını kontrol edin ve eksik değerleri ekleyin.');
  process.exit(1);
}

// Güvenlik kontrolü - production'da varsayılan değerler olmamalı
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET.includes('default') || 
      process.env.JWT_SECRET.includes('secret') ||
      process.env.JWT_SECRET.length < 32) {
    console.error('💥 Production ortamında güvensiz JWT_SECRET!');
    console.error('🔒 En az 32 karakter uzunluğunda benzersiz bir key kullanın.');
    process.exit(1);
  }
}

const config = {
  // Server ayarları
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // JWT ayarları
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // Admin ayarları
  admin: {
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH
  },
  
  // Database ayarları
  database: {
    mongoUri: process.env.MONGODB_URI
  },
  
  // Güvenlik ayarları
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
  },
  
  // CORS ayarları
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
};

export default config; 