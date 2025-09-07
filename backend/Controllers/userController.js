const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function signup(req, res) {
  try {
    const { name, email, password, address } = req.body
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = new User({ name, email, password, address })
    await user.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Use environment variable for JWT secret
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'default_secret_CHANGE_THIS_IN_PRODUCTION', 
      { expiresIn: '1d' }
    )
    
    res.json({ 
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function profile(req, res) {
  try {
    // User is already attached to req by the auth middleware
    // Remove password from the response
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      address: req.user.address,
      createdAt: req.user.createdAt
    };
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function getOrders(req, res) {
  try {
    // Assuming we have an Order model that links to users
    // const orders = await Order.find({ user: req.user._id });
    
    // For now, return a placeholder response
    res.json({
      message: 'Order history feature coming soon',
      orders: []
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { signup, login, profile, getOrders }
