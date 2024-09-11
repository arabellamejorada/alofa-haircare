const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// INVENTORY ROUTES
router.get('/inventory', inventoryController.getAllInventories);     // Read all inventories
router.get('/inventory/:id', inventoryController.getInventoryById);  // Read inventory by ID
router.put('/inventory/:id', inventoryController.updateInventoryQuantityById); // Update

module.exports = router;
