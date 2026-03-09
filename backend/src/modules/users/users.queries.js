import { db } from '../../config/database.js';

// Get user profile (never return password_hash)
export const getUserById = async (id) => {
  const result = await db.query(
    `SELECT id, email, full_name, avatar_url, is_email_verified, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update user profile
export const updateUser = async (id, { full_name, avatar_url }) => {
  const result = await db.query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, email, full_name, avatar_url, updated_at`,
    [full_name, avatar_url, id]
  );
  return result.rows[0];
};

// Get all active sessions for a user
export const getUserSessions = async (user_id) => {
  const result = await db.query(
    `SELECT id, device_info, ip_address, created_at, expires_at
     FROM sessions
     WHERE user_id = $1 AND is_revoked = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Revoke all sessions (logout from all devices)
export const revokeAllSessions = async (user_id) => {
  await db.query(
    `UPDATE sessions SET is_revoked = TRUE WHERE user_id = $1`,
    [user_id]
  );
};