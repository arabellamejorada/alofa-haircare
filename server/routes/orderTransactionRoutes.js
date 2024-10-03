const express = require('express');
const router = express.Router();
const orderTransactionController = require('../controllers/orderTransactionController');

router.post('/order', orderTransactionController.createOrder);
router.get('/order/:order_id', orderTransactionController.getOrderByOrderId);
router.get('/orders/:customer_id', orderTransactionController.getOrderByCustomerId);
router.get('/orders', orderTransactionController.getAllOrders);

module.exports = router;
