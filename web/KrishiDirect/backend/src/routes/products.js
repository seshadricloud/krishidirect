// filepath: KrishiDirect/KrishiDirect/backend/src/routes/products.js
import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post('/', createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', deleteProduct);

export default router;