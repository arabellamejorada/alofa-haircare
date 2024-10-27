const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.createOrder);
router.get('/order/all', orderController.getAllOrdersWithOrderItems);
router.get('/order/customer/:customer_id', orderController.getOrderByCustomerId);
router.get('/order/:order_id', orderController.getOrderByOrderId);
router.get('/order/:order_id/items', orderController.getOrderItemsByOrderId);

module.exports = router;
