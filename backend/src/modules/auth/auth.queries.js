import { db } from '../../config/database.js';

// Find user by email
export const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0]; // undefined if not found
};

// Find user by ID
export const findUserById = async (id) => {
  const result = await db.query(
    'SELECT id, email, full_name, avatar_url, is_email_verified, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Create new user
export const createUser = async ({ full_name, email, password_hash }) => {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, created_at`,
    [full_name, email, password_hash]
  );
  return result.rows[0];
};

// Save a session (refresh token)
export const createSession = async ({ user_id, refresh_token, device_info, ip_address, expires_at }) => {
  await db.query(
    `INSERT INTO sessions (user_id, refresh_token, device_info, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [user_id, refresh_token, device_info, ip_address, expires_at]
  );
};

// Find session by refresh token
export const findSession = async (refresh_token) => {
  const result = await db.query(
    `SELECT * FROM sessions WHERE refresh_token = $1 AND is_revoked = FALSE`,
    [refresh_token]
  );
  return result.rows[0];
};

// Revoke a session (logout)
export const revokeSession = async (refresh_token) => {
  await db.query(
    `UPDATE sessions SET is_revoked = TRUE WHERE refresh_token = $1`,
    [refresh_token]
  );
};

// Save email verification token
export const createEmailVerification = async ({ user_id, token, expires_at }) => {
  await db.query(
    `INSERT INTO email_verifications (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user_id, token, expires_at]
  );
};

// Find and validate email verification token
export const findEmailVerification = async (token) => {
  const result = await db.query(
    `SELECT * FROM email_verifications
     WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()`,
    [token]
  );
  return result.rows[0];
};

// Mark token as used + verify user
export const markEmailVerified = async (token, user_id) => {
  await db.query(
    `UPDATE email_verifications SET used_at = NOW() WHERE token = $1`,
    [token]
  );
  await db.query(
    `UPDATE users SET is_email_verified = TRUE WHERE id = $1`,
    [user_id]
  );
};