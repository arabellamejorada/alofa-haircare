const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.createOrGetCart);            
router.post('/cart/:cart_id/add-item', cartController.addCartItem);
router.put('/cart/:cart_id/update-item', cartController.updateCartItem);
router.get('/cart/all', cartController.getAllCarts);
router.get('/cart/:cart_id', cartController.getCartById);
router.delete('/cart/:cart_id/item/:cart_item_id', cartController.deleteCartItem);
router.delete('/cart/:cart_id', cartController.deleteCart);
router.post('/cart/merge', cartController.mergeCarts);

module.exports = router;
