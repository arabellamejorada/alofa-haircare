const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

// Test route
router.get('/test', (req, res) => res.status(200).send('Test route working'));

// Voucher routes
router.get('/voucher/all/used', voucherController.getAllUsedVouchers);
router.get('/voucher/all', voucherController.getAllVouchers);
router.get('/voucher/variations/:id', voucherController.getVoucherProductVariations);
router.post('/voucher/apply', voucherController.applyVoucher);
router.post('/voucher', voucherController.createVoucher);
router.get('/voucher/:id', voucherController.getVoucherById);
router.put('/voucher/:id', voucherController.updateVoucher);
router.post('/voucher/add-variation', voucherController.addVoucherProductVariation);
router.delete('/voucher/remove-variation', voucherController.removeVoucherProductVariation);
router.post('/voucher/manage-variations', voucherController.manageVoucherVariations); // New route
router.delete('/voucher/:id', voucherController.deleteVoucher);

module.exports = router;
