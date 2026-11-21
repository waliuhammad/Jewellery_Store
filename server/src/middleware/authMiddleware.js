import { auth, isFirebaseConnected } from '../config/firebase.js';

/**
 * Authenticates request via Firebase ID Token
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token missing or invalid. Please sign in.',
        },
      });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;

    if (isFirebaseConnected && auth && typeof auth.verifyIdToken === 'function') {
      decodedToken = await auth.verifyIdToken(token);
    } else {
      // Development mode fallback
      decodedToken = {
        uid: req.headers['x-mock-uid'] || 'usr_local_test',
        email: req.headers['x-mock-email'] || 'client@aurellejewels.com',
        role: req.headers['x-mock-role'] || 'customer',
      };
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication session. Please sign in again.',
      },
    });
  }
}

/**
 * Optional Auth: Attaches req.user if a valid token is provided, but allows guest pass-through.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (isFirebaseConnected && auth && typeof auth.verifyIdToken === 'function') {
        req.user = await auth.verifyIdToken(token);
      } else {
        req.user = {
          uid: req.headers['x-mock-uid'] || 'usr_local_test',
          email: req.headers['x-mock-email'] || 'client@aurellejewels.com',
          role: req.headers['x-mock-role'] || 'customer',
        };
      }
    }
  } catch (e) {
    // Guest continues without attached req.user
  }
  next();
}

/**
 * Role-Based Access Control
 */
export function requireRole(allowedRoles = ['admin']) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const userRole = req.user.role || 'customer';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this administrative action.',
        },
      });
    }

    next();
  };
}

