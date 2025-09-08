// Custom seeding script
require('dotenv').config();
const mongoose = require('mongoose');
const seedProducts = require('./backend/seeding/productSeeder');
const seedUser = require('./backend/seeding/userSeeder');

console.log('Starting database seeding process...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('MongoDB connection established successfully');
  
  try {
    console.log('Seeding users...');
    const user = await seedUser();
    console.log(`User seeded with ID: ${user._id}`);
    
    console.log('Seeding products...');
    const products = await seedProducts();
    console.log(`${products.length} products seeded successfully`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
