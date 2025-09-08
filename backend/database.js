
const mongoose = require('mongoose')
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
})

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce'

// Connect to MongoDB with improved error handling
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('MongoDB connection established successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit with failure if database connection fails
});

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// If Node process ends, close MongoDB connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose
