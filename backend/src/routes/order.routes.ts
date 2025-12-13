import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderStatusHistory } from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.get('/:orderId/history', getOrderStatusHistory);

export default router;
