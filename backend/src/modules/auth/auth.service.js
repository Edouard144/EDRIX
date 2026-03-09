import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { generateSecureToken } from '../../utils/crypto.js';
import * as queries from './auth.queries.js';

// ── REGISTER
export const register = async ({ full_name, email, password }, req) => {
  // 1. Check if email already taken
  const existing = await queries.findUserByEmail(email);
  if (existing) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash the password (never store plain text)
  const password_hash = await hashPassword(password);

  // 3. Create user in DB
  const user = await queries.createUser({ full_name, email, password_hash });

  // 4. Generate email verification token (expires in 24h)
  const token = generateSecureToken();
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await queries.createEmailVerification({ user_id: user.id, token, expires_at });

  // TODO: send verification email (Month 1 Week 3)
  console.log(`📧 Verify token for ${email}: ${token}`);

  return user;
};

// ── LOGIN
export const login = async ({ email, password }, req) => {
  // 1. Find user
  const user = await queries.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 2. Check password
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate tokens
  const payload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 4. Save session
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await queries.createSession({
    user_id: user.id,
    refresh_token: refreshToken,
    device_info: req.headers['user-agent'] || 'unknown',
    ip_address: req.ip,
    expires_at,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_email_verified: user.is_email_verified,
    },
  };
};

// ── REFRESH TOKEN
export const refresh = async (refreshToken) => {
  // 1. Verify token signature
  const decoded = verifyRefreshToken(refreshToken);

  // 2. Check session exists and not revoked
  const session = await queries.findSession(refreshToken);
  if (!session) {
    const error = new Error('Session expired or revoked');
    error.statusCode = 401;
    throw error;
  }

  // 3. Issue new access token
  const accessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
  });

  return { accessToken };
};

// ── LOGOUT
export const logout = async (refreshToken) => {
  await queries.revokeSession(refreshToken);
};

// ── VERIFY EMAIL
export const verifyEmail = async (token) => {
  const record = await queries.findEmailVerification(token);
  if (!record) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 400;
    throw error;
  }
  await queries.markEmailVerified(token, record.user_id);
};