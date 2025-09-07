const express = require('express')
const router = express.Router()
const productController = require('../Controllers/productController')
const { authenticateUser, optionalAuthenticateUser } = require('../middleware/authMiddleware')

// Public routes - can be accessed without authentication
router.get('/', optionalAuthenticateUser, productController.getProducts) // Optional auth for personalization
router.get('/:id', optionalAuthenticateUser, productController.getProduct) // Optional auth for personalization

// Protected routes - require authentication
router.post('/', authenticateUser, productController.createProduct)
router.put('/:id', authenticateUser, productController.updateProduct)
router.delete('/:id', authenticateUser, productController.deleteProduct)

module.exports = router
