const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.createOrGetCart);        // Initialize or retrieve Cart
router.post('/cart/add', cartController.addItemToCart);     // Add item to Cart
router.get('/cart', cartController.viewCart);               // View Cart
router.post('/cart/checkout', cartController.checkoutCart); // Checkout Cart

module.exports = router;
