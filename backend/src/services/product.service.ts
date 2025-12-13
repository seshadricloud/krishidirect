import productModel from '../models/product.model';
import type { Product } from '../models/product.model';

/**
 * ProductService - thin layer over the model.
 * Exposes CRUD methods used by controllers.
 */
const ProductService = {
  /**
   * Get all products from the database.
   * @returns {Promise<Product[]>} List of products.
   */
  getProducts: async (): Promise<Product[]> => {
    return productModel.getAll();
  },

  /**
   * Get a product by its ID.
   * @param {string} id - The ID of the product.
   * @returns {Promise<Product | null>} The product if found, otherwise null.
   */
  getProductById: async (id: string): Promise<Product | null> => {
    return productModel.getById(id);
  },

  /**
   * Create a new product in the database.
   * @param {Product} productData - The data for the new product.
   * @returns {Promise<Product>} The created product.
   */
  createProduct: async (payload: Omit<Product, 'id'>): Promise<Product> => {
    return productModel.create(payload);
  },

  // Patch/update a product
  update: async (id: string, patch: Partial<Product>): Promise<Product | null> => {
    // model.update returns Product | null in in-memory implementation
    return productModel.update ? productModel.update(id, patch) : Promise.resolve(null);
  },

  // Delete a product by id
  delete: async (id: string): Promise<boolean> => {
    return productModel.delete ? productModel.delete(id) : Promise.resolve(false);
  },
};

export default ProductService;