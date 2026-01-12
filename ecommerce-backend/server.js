const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // Added for static files
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
// 1. Security & Logging Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows images to load on frontend
})); 
app.use(cors({
  origin: 'https://frontend-3gei.onrender.com/api', 
  credentials: true
}));
app.use(morgan('dev')); 

// Middleware for parsing body
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads (Crucial for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// 3. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// --- ADDED REVIEWS ROUTE ---
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 4. Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server` });
});

// 5. Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`[Error Handler] ${err.message}`);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => process.exit(1));
});
