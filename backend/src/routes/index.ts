import express from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import orderRoutes from './order.routes';
import notificationRoutes from './notification.routes';
import priceRoutes from './price.routes';

// Create a router instance
const router = express.Router();

// Define the base route for the API
router.get('/', (req, res) => {
    res.send('Welcome to KrishiDirect API');
});

// Use authentication routes
router.use('/auth', authRoutes);

// Use product routes
router.use('/products', productRoutes);

// Use order routes
router.use('/orders', orderRoutes);

// Use notification routes
router.use('/notifications', notificationRoutes);

// Use price routes
router.use('/prices', priceRoutes);

// Export the router
export default router;