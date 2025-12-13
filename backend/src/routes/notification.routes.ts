import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '../controllers/notification.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

export default router;
