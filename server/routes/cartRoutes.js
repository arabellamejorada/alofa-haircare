const express = require('express');
const router = express.Router();

// Importing cart controller
const cartController = require('../controllers/cartController');

// Define the routes and link them to controller functions
router.post('/cart', cartController.initializeCart);        // Initialize Cart
router.post('/cart/add', cartController.addItemToCart);     // Add item to Cart
router.get('/cart', cartController.viewCart);               // View Cart
router.post('/cart/checkout', cartController.checkoutCart); // Checkout Cart

module.exports = router;
