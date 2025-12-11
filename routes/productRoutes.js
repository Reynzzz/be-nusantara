const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { productUpload } = require('../config/multer');

// GET /api/products - Get all products (optional query: ?category=jersey)
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// POST /api/products - Create new product (with image upload)
router.post('/', productUpload.single('image'), createProduct);

// PUT /api/products/:id - Update product (with optional image upload)
router.put('/:id', productUpload.single('image'), updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;

