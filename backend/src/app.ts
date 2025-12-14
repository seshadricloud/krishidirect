import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import routes from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import { connectDB } from './config/index';
import path from 'path';
import ProductService from './services/product.service';

// Initialize the Express application
const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log requests to the console
app.use(json({ limit: '10mb' })); // Parse JSON request bodies with larger limit for base64 images
app.use(urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded request bodies
app.use(express.json({ limit: '10mb' }));

// Set up routes
app.use('/api', routes);

// simple health & root routes so browser requests don't 404
app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  return res.send('KrishiDirect API is running. See /health or /api/*');
});

// Seed route for testing - to be removed in production
app.get('/api/_seed', async (_req, res) => {
  try {
    // Get or create a test user first
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    let user = await prisma.user.findFirst({ where: { role: 'farmer' } });
    if (!user) {
      const bcrypt = await import('bcryptjs');
      user = await prisma.user.create({
        data: {
          email: 'farmer@test.com',
          name: 'Test Farmer',
          password: await bcrypt.hash('password', 10),
          role: 'farmer'
        }
      });
    }

    const created = await ProductService.createProduct({
      name: 'Fresh Tomatoes',
      price: 45,
      quantity: 50,
      unit: 'kg',
      category: 'Vegetables',
      description: 'Organic red tomatoes',
      location: 'Punjab',
      userId: user.id,
      image: 'https://images.unsplash.com/photo-1546470427-e26264815d31?w=400&q=80'
    });
    
    await prisma.$disconnect();
    return res.json(created);
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'web', 'dist'); // adjust if folder differs
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// Error handling middleware
app.use(errorHandler);

// Export the app for use in the server file
export default app;