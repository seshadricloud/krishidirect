// filepath: KrishiDirect/KrishiDirect/backend/src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import farmerRoutes from './routes/farmers.js';
import orderRoutes from './routes/orders.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(authMiddleware); // JWT authentication middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start the server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;