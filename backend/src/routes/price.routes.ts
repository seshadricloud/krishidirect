import { Router } from 'express';
import { getMarketPrices, getPriceHistory, recordPrice } from '../controllers/price.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/market', getMarketPrices);
router.get('/history/:category', getPriceHistory);

// Protected routes
router.post('/', authMiddleware, recordPrice);

export default router;
