const mongoose = require('../database');
const seedProducts = require('./productSeeder');
const seedUser = require('./userSeeder');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Seed test user
    const user = await seedUser();
    console.log(`User seeded with ID: ${user._id}`);
    
    // Seed products
    const products = await seedProducts();
    console.log(`${products.length} products seeded successfully`);
    
    console.log('Database seeding completed successfully!');
    return { user, products };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close database connection
    mongoose.connection.close();
  }
}

// Run the script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('All seeding operations completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
