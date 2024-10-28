const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.createCart);            
router.post('/cart/:cart_id/add', cartController.addCartItem);
router.put('/cart/:cart_id/update', cartController.updateCartItem);
router.get('/cart/all', cartController.getAllCarts);
router.get('/cart/:cart_id', cartController.getCartById);
router.get('/cart/customer/:customer_id', cartController.getCartByCustomerId);
router.delete('/cart/:cart_id/item/:variation_id', cartController.deleteCartItem);
router.delete('/cart/:cart_id', cartController.deleteCart);
router.post('/cart/merge', cartController.mergeCarts);

module.exports = router;
