const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const productVariationsController = require("../controllers/productVariationsController");
const upload = require("../middlewares/multerConfig");

// PRODUCT
router.post(
  "/products",
  upload.array("images", 15),
  productController.createProductWithVariationAndInventory,
);
// router.post('/products', productController.createProduct); // Create
router.get("/products", productController.getAllProducts); // Read all
router.get("/products/:id", productController.getProductById); // Read by ID
router.put("/products/:id", productController.updateProduct); // Update by ID
router.put("/products/:id/archive", productController.archiveProduct); // Archive by ID
router.delete("/products/:id", productController.deleteProduct); // Delete by ID

// PRODUCT CATEGORY
router.post("/product-category", productController.createProductCategory); // Create
router.get("/product-category", productController.getAllProductCategories); // Read all
router.get("/product-category/:id", productController.getProductCategoryById); // Read by ID
router.put("/product-category/:id", productController.updateProductCategory); // Update by ID
router.delete("/product-category/:id", productController.deleteProductCategory); // Delete by ID

// PRODUCT VARIATION
// router.post("/product-variations", upload.array("images", 15), productVariationsController.createProductVariationsWithInventory);
router.get(
  "/product-variations",
  productVariationsController.getAllProductVariations,
); // Read all
router.get(
  "/product-variations/:id",
  productVariationsController.getProductVariationById,
); // Read by ID
router.put(
  "/product-variations/:id",
  upload.single("image"),
  productVariationsController.updateProductVariation,
);
router.put(
  "/product-variations/:id/archive",
  productVariationsController.archiveProductVariation,
); // Archive product variation
router.delete(
  "/product-variations/:id",
  productVariationsController.deleteProductVariation,
); // Delete by ID
router.delete(
  "/product-variations",
  productVariationsController.deleteAllProductVariations,
); // Delete all

// PRODUCT STATUS
router.post("/product-status", productController.createProductStatus); // Create
router.get("/product-status", productController.getAllProductStatus); // Read all
router.get("/product-status/:id", productController.getProductStatusById); // Read by ID
router.put("/product-status/:id", productController.updateProductStatus); // Update by ID
router.delete("/product-status/:id", productController.deleteAllProductStatus); // Delete by ID

module.exports = router;
