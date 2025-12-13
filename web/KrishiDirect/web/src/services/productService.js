// filepath: KrishiDirect/KrishiDirect/web/src/services/productService.js
import api from './apiClient';

/**
 * Fetch all products from the API.
 * @returns {Promise<Array>} List of products.
 */
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

/**
 * Fetch a product by its ID from the API.
 * @param {string} id - The ID of the product.
 * @returns {Promise<Object>} The product details.
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product: ' + error.message);
  }
};

export default {
  getProducts,
  getProductById,
};