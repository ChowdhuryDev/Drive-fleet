import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Express Authentication Middleware for Better Auth.
 * Adheres strictly to Requirement 19:
 * 1. Reads Authorization header for Bearer token (or secure session cookie).
 * 2. Verifies Better Auth token via JWT verification or session document check.
 * 3. Extracts authenticated user identity and attaches to req.user.
 * 4. Never trusts client-supplied req.body.ownerEmail or req.body.userEmail.
 */
export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1]?.trim() : null;

    const cookieSessionToken =
      req.cookies?.['better-auth.session_token'] ||
      req.cookies?.['__Secure-better-auth.session_token'];

    const token = bearerToken || cookieSessionToken;

    // Requirement 19: For missing authentication -> HTTP 401
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.',
      });
      return;
    }

    const secret = process.env.BETTER_AUTH_SECRET;

    // 1. Try Better Auth JWT Bearer Token verification
    if (bearerToken && secret) {
      try {
        const decoded = jwt.verify(bearerToken, secret) as any;
        if (decoded && (decoded.email || decoded.sub)) {
          req.user = {
            id: decoded.sub || decoded.id,
            email: (decoded.email || '').toLowerCase(),
            name: decoded.name || 'User',
            image: decoded.picture || decoded.image || '',
          };
          return next();
        }
      } catch (jwtErr) {
        // Fallback to checking session database if token is an opaque session token
      }
    }

    // 2. Query MongoDB 'session' collection directly for active session
    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      if (db) {
        const sessionDoc = await db.collection('session').findOne({
          token: token,
          expiresAt: { $gt: new Date() },
        });

        if (sessionDoc) {
          const userDoc = await db.collection('user').findOne({
            $or: [
              { _id: sessionDoc.userId },
              { id: sessionDoc.userId },
              ...(mongoose.isValidObjectId(sessionDoc.userId)
                ? [{ _id: new mongoose.Types.ObjectId(sessionDoc.userId) }]
                : []),
            ],
          });

          if (userDoc) {
            req.user = {
              id: userDoc.id || userDoc._id?.toString(),
              email: (userDoc.email || '').toLowerCase(),
              name: userDoc.name || 'User',
              image: userDoc.image || '',
            };
            return next();
          }
        }
      }
    }

    // Requirement 19: For invalid or expired authentication -> HTTP 401
    res.status(401).json({
      success: false,
      message: 'Your authentication session is invalid or expired.',
    });
  } catch (error) {
    console.error('verifyAuth middleware exception:', error);
    res.status(401).json({
      success: false,
      message: 'Your authentication session is invalid or expired.',
    });
  }
};

// Export requireAuth alias for backwards compatibility
export const requireAuth = verifyAuth;
export default verifyAuth;
