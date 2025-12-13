import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller';

const router = Router();

// Create a review (authenticated)
router.post('/', authMiddleware, createReview);

// Get all reviews for a product (public)
router.get('/product/:productId', getProductReviews);

// Update a review (authenticated, own review only)
router.patch('/:id', authMiddleware, updateReview);

// Delete a review (authenticated, own review only)
router.delete('/:id', authMiddleware, deleteReview);

export default router;
