import mongoose from 'mongoose';
import config from './config.js';

const connectDatabase = async () => {
  try {
    // Deprecated options'ları kaldırdık
    const conn = await mongoose.connect(config.database.mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB Disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDatabase;