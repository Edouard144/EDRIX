import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

// Attach this to any route that requires login
// It checks the Authorization header for a valid JWT
export const requireAuth = (req, res, next) => {
  try {
    // Header format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', 401);
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    const decoded = verifyAccessToken(token); // Verify + decode

    req.user = decoded; // { userId, email } now available in every controller
    next();
  } catch (err) {
    // Token expired or invalid
    return sendError(res, 'Invalid or expired token', 401);
  }
};