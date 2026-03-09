import crypto from 'crypto';

// Generate a secure random token (for email verification, password reset)
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex'); // 64 char string
};