const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
router.get('/test', (req, res) => res.status(200).send('Test route working'));

router.get('/voucher/all', voucherController.getAllVouchers); 
router.post('/voucher/apply', voucherController.applyVoucher);
router.get('/voucher/code/:code', voucherController.getVoucherByCode);
router.get('/voucher/:id', voucherController.getVoucherById);
router.post('/voucher', voucherController.createVoucher);
router.put('/voucher/:id', voucherController.updateVoucher);
router.delete('/voucher/:id', voucherController.deleteVoucher);

module.exports = router;
