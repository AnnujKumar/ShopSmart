
const express = require('express')
const cors = require('cors')
const app = express()
const userRoutes = require('./Routes/userRoutes')
const productRoutes = require('./Routes/productRoutes')
const cartRoutes = require('./Routes/cartRoutes')
const errorHandler = require('./middleware/errorHandler')

// Set up environment variables for JWT
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_should_be_long_and_secure_in_production';

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

// Error handling middleware should be last
app.use(errorHandler)

module.exports = app
