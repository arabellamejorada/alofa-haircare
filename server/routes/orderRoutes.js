const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const refundController = require('../controllers/refundController');
const upload = require('../middlewares/multerConfig');

router.post('/order/checkout', upload.single('proof_image'), orderController.createOrder);
router.get('/order/all', orderController.getAllOrdersWithOrderItems);
router.get('/order/customer/:profile_id', orderController.getOrderByProfileId);
router.get('/order/:order_id', orderController.getOrderByOrderId);
router.get('/order/:order_id/items', orderController.getOrderItemsByOrderId);

// Update payment status of an order
router.put('/order/:order_id/payment-status', orderController.updateOrderPaymentStatus);

// Update order status of an order
router.put('/order/:order_id/order-status', orderController.updateOrderStatus);

router.put('/shipping/:shipping_id/status', orderController.updateShippingStatusAndTrackingNumber);



// Refund routes
router.post('/refund', upload.array('refund_proof', 5), refundController.createRefundRequest);
router.get('/refund/requests/:profile_id', refundController.getRefundRequestsByProfileId);

module.exports = router;
