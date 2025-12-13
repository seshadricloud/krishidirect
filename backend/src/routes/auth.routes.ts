import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Use bound methods so `this` inside class methods works
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', authMiddleware, authController.getProfile.bind(authController));

export default router;