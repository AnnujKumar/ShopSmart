const Cart = require('../models/Cart')
const Product = require('../models/Product')
const mongoose = require('mongoose')

async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body
    const userId = req.user._id // Get userId from authenticated user
    
    // Basic validation
    if (!productId || !quantity) {
      return res.status(400).json({ 
        error: 'Missing required fields (productId, quantity)' 
      });
    }
    
    // Check if productId is a valid ObjectId format to prevent CastError
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        error: 'Invalid product ID format',
        details: productId
      });
    }
    
    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ 
        error: 'Product not found',
        details: `No product exists with ID: ${productId}`
      });
    }
    
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }
    
    await cart.save()
    
    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart)
  } catch (err) {
    next(err)
  }
}

async function getCart(req, res, next) {
  try {
    const userId = req.user._id // Get userId from authenticated user
    
    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    
    if (!cart) {
      // If no cart found, return an empty cart structure rather than null
      return res.json({ user: userId, items: [] });
    }
    
    res.json(cart)
  } catch (err) {
    next(err)
  }
}

async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.body
    const userId = req.user._id // Get userId from authenticated user
    
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ error: 'Cart not found' })
    
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item.product.toString() !== productId)
    
    // If no items were removed, the product wasn't in the cart
    if (initialItemCount === cart.items.length) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    
    await cart.save()
    
    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart)
  } catch (err) {
    next(err)
  }
}

async function updateQuantity(req, res, next) {
  try {
    const { productId, quantity } = req.body
    const userId = req.user._id // Get userId from authenticated user
    
    // Input validation
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' })
    }
    
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ error: 'Cart not found' })
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity
    } else {
      return res.status(404).json({ error: 'Product not found in cart' })
    }
    
    await cart.save()
    
    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart)
  } catch (err) {
    next(err)
  }
}

async function updateCart(req, res, next) {
  try {
    const { items } = req.body
    const userId = req.user._id // Get userId from authenticated user
    
    // Input validation
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    
    // Validate each item in the array
    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ 
          error: 'Each item must have a product ID and a quantity of at least 1',
          invalidItem: item
        });
      }
      
      // Check if productId is a valid ObjectId format
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ 
          error: 'Invalid product ID format',
          invalidId: item.product
        });
      }
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }
    
    // Replace cart items with new items
    cart.items = items.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    
    await cart.save()
    
    // Populate product details before returning
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart)
  } catch (err) {
    next(err)
  }
}

module.exports = { addToCart, getCart, removeFromCart, updateQuantity, updateCart }
