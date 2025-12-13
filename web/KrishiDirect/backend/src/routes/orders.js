// filepath: KrishiDirect/KrishiDirect/backend/src/routes/orders.js
import express from 'express';
import { placeOrder, getOrderStatus } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to place a new order
router.post('/', authMiddleware, placeOrder);

// Route to get the status of an existing order
router.get('/:orderId', authMiddleware, getOrderStatus);

export default router;