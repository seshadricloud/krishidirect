// filepath: KrishiDirect/KrishiDirect/backend/src/controllers/productController.js

import Product from '../models/productModel.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res) => {
    const { name, price, description, image } = req.body;
    try {
        const newProduct = new Product({ name, price, description, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, image }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};