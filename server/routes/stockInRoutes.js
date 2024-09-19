const express = require('express');
const router = express.Router();
const stockInController = require("../controllers/stockInController");

router.post('/stock-in', stockInController.createStockIn);
router.get('/stock-in', stockInController.getAllStockIn);
router.get('/stock-in/:id', stockInController.getStockInById); 

module.exports = router;


