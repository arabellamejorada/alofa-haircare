const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// INVENTORY ROUTES
router.get('/inventory', inventoryController.getAllInventories);     // Read all inventories
router.get('/inventory/:id', inventoryController.getInventoryById);  // Read inventory by ID
router.put('/inventory/:id', inventoryController.updateInventoryById); // Update
router.get('/inventory-history', inventoryController.getAllInventoryHistory); // Read all inventory movement
router.get('/inventory/history/:id', inventoryController.getInventoryHistoryByVariationId); // Read inventory movement by variation ID

module.exports = router;
