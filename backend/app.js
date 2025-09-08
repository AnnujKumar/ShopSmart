
const express = require('express')
const cors = require('cors')
const path = require('path')

// Try to load environment variables from file, but don't fail if files don't exist
try {
  require('dotenv').config({
    path: process.env.NODE_ENV === 'production' 
      ? path.resolve(process.cwd(), '.env.production')
      : path.resolve(process.cwd(), '.env.development')
  })
} catch (error) {
  console.log('Environment files not found, using environment variables directly')
}

const app = express()
const userRoutes = require('./Routes/userRoutes')
const productRoutes = require('./Routes/productRoutes')
const cartRoutes = require('./Routes/cartRoutes')
const errorHandler = require('./middleware/errorHandler')

// Set up environment variables for JWT
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_should_be_long_and_secure_in_production';

// Enable CORS for all routes
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json())
// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ShopSmart API is running!',
    version: '1.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart'
    }
  });
});

// Add a simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running!' });
});

// Add a root route handler to avoid 404 errors
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'ShopSmart API is running!',
    endpoints: [
      '/api/health',
      '/api/users',
      '/api/products',
      '/api/cart'
    ] 
  });
});

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

// Handle 404 errors for any undefined routes
app.use((req, res, next) => {
  res.status(404).json({ 
    status: 'error',
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware should be last
app.use(errorHandler)

module.exports = app
