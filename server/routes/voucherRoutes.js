const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

router.get('/voucher/all', voucherController.getAllVouchers);
router.get('/voucher/:id', voucherController.getVoucherById);
router.post('/voucher', voucherController.createVoucher);
router.put('/voucher/:id', voucherController.updateVoucher);
router.delete('voucher/:id', voucherController.deleteVoucher);

module.exports = router;
