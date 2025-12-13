import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

// Extend Express Request type (keeps runtime-free)
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}

// Auth middleware verifying JWT and normalizing payload into req.user
export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // jwt.verify can return string or JwtPayload; normalize to object with id
    const payload = typeof decoded === 'string' ? { id: decoded } : (decoded as JwtPayload);
    // Ensure req.user shape matches our TS augmentation
    req.user = { id: String((payload as any).id ?? (payload as any).sub), ...(payload as object) };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}