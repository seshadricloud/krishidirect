// Extend Express Request with `user` used by auth middleware
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

export {};