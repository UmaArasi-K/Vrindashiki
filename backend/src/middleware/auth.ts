import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'vrindashiki-dev-secret-change-in-production';

/** Extend Express Request type to carry the decoded user */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * JWT authentication middleware.
 * Reads `Authorization: Bearer <token>`, verifies it, and attaches
 * the decoded user to `req.user`. Returns 401 on missing/invalid tokens.
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
