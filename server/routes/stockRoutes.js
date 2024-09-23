const express = require('express');
const router = express.Router();
const stockInController = require("../controllers/stockInController");
const stockOutController = require("../controllers/stockOutController");

router.post('/stock-in', stockInController.createStockIn);
router.get('/stock-in', stockInController.getAllStockIn);
router.get('/stock-in/:id', stockInController.getStockInById); 

router.post('/stock-out', stockOutController.createStockOut);
router.get('/stock-out', stockOutController.getAllStockOut);
router.get('/stock-out/:id', stockOutController.getStockOutById);

module.exports = router;


