const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')
const { authenticateUser } = require('../middleware/authMiddleware')

// Public routes
router.post('/signup', userController.signup)
router.post('/login', userController.login)

// Protected routes
router.get('/profile', authenticateUser, userController.profile)
router.get('/orders', authenticateUser, userController.getOrders)
router.get('/verify-token', authenticateUser, (req, res) => {
  // If this route is reached, it means the token is valid (authenticateUser middleware passed)
  res.status(200).json({ message: 'Token is valid', user: { id: req.user._id } });
})

module.exports = router
