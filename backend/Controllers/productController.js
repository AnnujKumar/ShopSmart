const Product = require('../models/Product')
const mongoose = require('mongoose')

async function createProduct(req, res, next) {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

async function getProducts(req, res, next) {
  try {
    // Support filtering by category
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    
    // Support price filtering
    if (req.query.maxPrice) {
      filter.price = { $lte: parseFloat(req.query.maxPrice) };
    }
    
    // Support text search
    if (req.query.search && req.query.search.trim() !== '') {
      const searchTerm = req.query.search.trim();
      // Search in name and description using case-insensitive regex
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    console.log('Search filter:', JSON.stringify(filter)); // Log for debugging
    
    const products = await Product.find(filter)
    res.json(products)
  } catch (err) {
    next(err)
  }
}

async function getProduct(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct }
