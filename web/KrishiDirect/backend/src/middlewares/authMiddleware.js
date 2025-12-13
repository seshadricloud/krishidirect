// filepath: KrishiDirect/KrishiDirect/backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;