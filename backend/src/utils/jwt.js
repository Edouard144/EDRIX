import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

// Access token — short lived (15 min)
// Sent with every request in Authorization header
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

// Refresh token — long lived (7 days)
// Used only to get a new access token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
  });
};

// Verify and decode a token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};