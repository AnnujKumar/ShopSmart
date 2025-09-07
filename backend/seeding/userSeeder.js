const mongoose = require('../database');
const User = require('../models/User');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  address: '123 Test Street',
  role: 'user'
};

async function seedUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('Test user already exists in the database');
      return existingUser;
    }
    
    // Create new user
    const user = new User(testUser);
    await user.save();
    
    console.log('Test user created successfully!');
    console.log(`User ID: ${user._id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: password123 (unhashed)`);
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

// Only run this script directly, not when imported
if (require.main === module) {
  seedUser()
    .then(() => {
      console.log('User seeding completed successfully');
      mongoose.connection.close();
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding user:', error);
      mongoose.connection.close();
      process.exit(1);
    });
}

module.exports = seedUser;
