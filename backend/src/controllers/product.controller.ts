// product.controller.ts

import { Request, Response } from 'express';
import ProductService from '../services/product.service';

// Controller functions used by products.routes.ts
// Keep these as named exports so the routes can import them directly.

/**
 * GET /api/products
 */
export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await ProductService.getProducts();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message || 'Failed to list products' });
  }
}

/**
 * GET /api/products/:id
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message || 'Failed to fetch product' });
  }
}

/**
 * POST /api/products
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, description, price, quantity, unit, category, image, images, location } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      category,
      image,
      images: images || [],
      location,
      userId
    };

    const created = await ProductService.createProduct(payload);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message || 'Failed to create product' });
  }
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const updated = await ProductService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message || 'Failed to update product' });
  }
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const ok = await ProductService.delete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message || 'Failed to delete product' });
  }
}