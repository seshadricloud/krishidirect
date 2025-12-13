// filepath: KrishiDirect/KrishiDirect/backend/src/services/productService.js

import Product from '../models/productModel.js';

// Fetch all products from the database
export const getProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    throw new Error('Error fetching product');
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error creating product');
  }
};

// Update an existing product by ID
export const updateProduct = async (id, productData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  } catch (error) {
    throw new Error('Error updating product');
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error('Product not found');
    }
    return deletedProduct;
  } catch (error) {
    throw new Error('Error deleting product');
  }
};