// filepath: KrishiDirect/KrishiDirect/backend/src/routes/auth.js
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for getting user profile (protected)
router.get('/profile', authMiddleware, getProfile);

export default router;