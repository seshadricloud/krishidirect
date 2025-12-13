// error.middleware.ts

import { Request, Response, NextFunction } from 'express';

// Global error handler (named export)
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Normalize error message
  const message = (err as Error)?.message || 'Internal Server Error';
  const status = (err as any)?.status || 500;
  res.status(status).json({ message });
}