// filepath: KrishiDirect/KrishiDirect/backend/src/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server
const server = express();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});