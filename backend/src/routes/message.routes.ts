import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  getConversation,
  getConversations,
  sendMessage
} from '../controllers/message.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all conversations
router.get('/conversations', getConversations);

// Get conversation with specific user
router.get('/:userId', getConversation);

// Send message (REST fallback)
router.post('/', sendMessage);

export default router;
