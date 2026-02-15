/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of Lumi.
 *
 * Lumi is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Verify user still exists in database
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ error: 'User account no longer exists' });
      return;
    }

    (req as AuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: (user.role as 'user' | 'admin') || 'user',
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Role-based authorization middleware
 * Must be used AFTER authenticate middleware
 * @param allowedRoles - Array of roles that can access the route
 */
export const authorizeRole = (...allowedRoles: Array<'user' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Populates req.user if valid token provided, but doesn't reject unauthenticated requests
 * Useful for public endpoints that want to personalize response for logged-in users
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without user context
      return next();
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (user) {
      (req as AuthRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: (user.role as 'user' | 'admin') || 'user',
      };
    }

    next();
  } catch {
    // Invalid token - continue without user context
    next();
  }
};
