const express = require('express')
const router = express.Router()
const cartController = require('../Controllers/cartController')
const { authenticateUser } = require('../middleware/authMiddleware')

// Protect all cart routes with authentication middleware
router.use(authenticateUser)

router.post('/add', cartController.addToCart)
router.get('/', cartController.getCart)
router.post('/remove', cartController.removeFromCart)
router.post('/update', cartController.updateQuantity)

module.exports = router
