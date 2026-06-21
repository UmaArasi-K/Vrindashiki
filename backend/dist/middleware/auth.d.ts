import { Request, Response, NextFunction } from 'express';
import type { AuthenticatedUser } from '../types';
/** Extend Express Request type to carry the decoded user */
export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}
/**
 * JWT authentication middleware.
 * Reads `Authorization: Bearer <token>`, verifies it, and attaches
 * the decoded user to `req.user`. Returns 401 on missing/invalid tokens.
 */
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map