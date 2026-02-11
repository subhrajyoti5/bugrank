import { Request, Response, NextFunction } from 'express';
import authService from '../services/AuthService';
import { User } from '@bugpulse/shared';

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * Middleware to authenticate requests using JWT or session token
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try JWT token from Authorization header first
    const authHeader = req.headers.authorization;
    let user: User | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = authService.verifyToken(token);
        user = await authService.getUserById(decoded.userId);
      } catch (error) {
        // JWT validation failed, try session token
      }
    }

    // If JWT failed or not provided, try session token
    if (!user) {
      const sessionToken = req.headers['x-session-token'] as string;
      
      if (sessionToken) {
        user = await authService.validateSession(sessionToken);
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid or expired token',
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Unauthorized - Authentication failed',
    });
  }
};

// Export for backward compatibility
export const authenticateToken = authMiddleware;
