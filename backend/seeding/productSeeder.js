const mongoose = require('../database');
const Product = require('../models/Product');

// Sample products data matching the dummy data in frontend
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 20-hour battery life',
    price: 129.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    stock: 50
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Tracks steps, heart rate, and sleep with 7-day battery life',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    stock: 35
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable, sustainable, and ethically made premium shirt',
    price: 24.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=80',
    stock: 100
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Vacuum insulated bottle keeps drinks cold for 24 hours',
    price: 34.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    stock: 75
  },
  {
    name: 'Bestselling Novel',
    description: 'Award-winning fiction by renowned author, hardcover edition',
    price: 19.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80',
    stock: 60
  },
  {
    name: 'Professional Chef Knife',
    description: 'German stainless steel 8-inch kitchen knife',
    price: 79.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=80',
    stock: 25
  }
];

// Function to seed products
async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products deleted');
    
    // Insert new products
    const createdProducts = await Product.create(products);
    console.log(`${createdProducts.length} products created successfully!`);
    
    // Print product IDs for reference
    console.log('Created product IDs:');
    createdProducts.forEach(product => {
      console.log(`${product.name}: ${product._id}`);
    });
    
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

// Only run this script directly, not when imported
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Products seeding completed successfully');
      mongoose.connection.close();
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding products:', error);
      mongoose.connection.close();
      process.exit(1);
    });
}

module.exports = seedProducts;
