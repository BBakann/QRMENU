import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import menuRoutes from './routes/menu.js';
import morgan from 'morgan';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);

// Test Route
app.get('/', (req, res) => {
    res.json({ message: "QRMenu Backend API is running" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server ${PORT} port is running: http://localhost:${PORT}`);
});