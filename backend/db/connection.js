import mongoose from 'mongoose';
import config from '../config/config.js';

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(config.database.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB bağlantısı başarılı: ${conn.connection.host}`);
        
        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB bağlantı hatası:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB bağlantısı kesildi');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔄 MongoDB bağlantısı kapatıldı');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database bağlantı hatası:', error);
        process.exit(1);
    }
};

export default connectDatabase; 