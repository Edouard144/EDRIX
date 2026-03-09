import crypto from 'crypto';

// Generate a secure random token (for email verification, password reset)
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex'); // 64 char string
};

// Generate a full API key (e.g., "edx_a1b2c3d4e5f6...")
export const generateApiKey = () => {
  const randomPart = crypto.randomBytes(32).toString('hex'); // 64 chars
  return `edx_${randomPart}`;
};

// Hash an API key for secure storage
export const hashApiKey = (apiKey) => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}; 