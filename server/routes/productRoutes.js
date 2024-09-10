const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/multerConfig');

// PRODUCT
// router.post('/products', upload.array('variation_images', 20), productController.createProductWithVariationsInventory);
router.post('/products', productController.createProduct); // Create
router.get('/products', productController.getAllProducts);              // Read all
router.get('/products/:id', productController.getProductById);          // Read by ID
router.put('/products/:id', upload.single('image'), productController.updateProduct);           // Update by ID
router.put('/products/:id/archive', productController.archiveProduct);  // Archive by ID
router.delete('/products/:id', productController.deleteProduct);        // Delete by ID

// PRODUCT CATEGORY
router.post('/product-category', productController.createProductCategory);      // Create
router.get('/product-category', productController.getAllProductCategories);     // Read all
router.get('/product-category/:id', productController.getProductCategoryById);  // Read by ID
router.put('/product-category/:id', productController.updateProductCategory);   // Update by ID
router.delete('/product-category/:id', productController.deleteProductCategory);// Delete by ID


// PRODUCT VARIATION
router.get('/product-variations', productController.getAllProductVariations);       // Read all
router.get('/product-variations/:id', productController.getProductVariationById);   // Read by ID
router.put('/product-variations/:id', productController.updateProductVariation);    // Update by ID
router.delete('/product-variations/:id', productController.deleteProductVariation); // Delete by ID

// PRODUCT STATUS
router.get('/product-status', productController.getAllProductStatus);       // Read all
router.get('/product-status/:id', productController.getProductStatusById);     // Read by ID
router.put('/product-status/:id', productController.updateProductStatus);      // Update by ID
router.delete('/product-status/:id', productController.deleteProductStatus);   // Delete by ID

module.exports = router;
