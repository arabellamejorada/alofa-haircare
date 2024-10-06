const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.createOrGetCart);        // Initialize or retrieve Cart
router.post('/cart/add-item', cartController.addItemToCart);     // Add item to Cart
router.get('/carts', cartController.getAllCarts);               // View Cart
router.get('/cart/items', cartController.viewCartItemsById);       // View Cart
router.delete('/cart/clear', cartController.clearCart);         // Clear Cart
router.post('/cart/checkout', cartController.checkoutCart); // Checkout Cart

module.exports = router;
