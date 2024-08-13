const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/product', productController.createProduct);       // Create
router.get('/product', productController.getAllProducts);       // Read all
router.get('/product/:id', productController.getProductById);   // Read by ID
router.put('/product/:id', productController.updateProduct);    // Update
router.delete('/product/:id', productController.deleteProduct); // Delete

module.exports = router;
