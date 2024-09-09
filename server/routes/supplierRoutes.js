const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController.js');

router.get('/suppliers', supplierController.getAllSuppliers);
router.get('/suppliers/:id', supplierController.getSupplierById);
router.post('/suppliers', supplierController.createSupplier);
router.put('/suppliers/:id', supplierController.updateSupplier);
router.put('/suppliers/:id/archive', supplierController.archiveSupplier);

module.exports = router;