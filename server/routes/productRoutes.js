const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Set storage options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Initialize Multer with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

// PRODUCT
router.post('/products', upload.single('image'), productController.createProductWithInventory); // Handle single file upload
router.get('/products', productController.getAllProducts);              // Read all
router.get('/products/:id', productController.getProductById);          // Read by ID
router.put('/products/:id', productController.updateProduct);           // Update by ID
router.delete('/products/:id', productController.deleteProduct);        // Delete by ID

// PRODUCT CATEGORY
router.post('/product-category', productController.createProductCategory);      // Create
router.get('/product-category', productController.getAllProductCategories);     // Read all
router.get('/product-category/:id', productController.getProductCategoryById);  // Read by ID
router.put('/product-category/:id', productController.updateProductCategory);   // Update by ID
router.delete('/product-category/:id', productController.deleteProductCategory);// Delete by ID


// INVENTORY
router.get('/inventory', productController.getAllInventories);     // Read all
router.get('/inventory/:id', productController.getInventoryById);   // Read
router.put('/inventory/:id', productController.updateInventory);    // Update
router.delete('/inventory/:id', productController.deleteInventory); // Delete


module.exports = router;
