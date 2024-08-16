const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!')); 
        }
    }
}).single('image');

// PRODUCT
router.post('/product', upload, productController.createProductWithInventory); // Create with file upload
router.get('/product', productController.getAllProducts);              // Read all
router.get('/product/:id', productController.getProductById);          // Read by ID
router.put('/product/:id', productController.updateProduct);           // Update by ID
router.delete('/product/:id', productController.deleteProduct);        // Delete by ID

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
