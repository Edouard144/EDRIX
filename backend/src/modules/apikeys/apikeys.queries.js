import { db } from '../../config/database.js';

// Save a new API key (only hash, never the full key)
export const createApiKey = async ({ org_id, user_id, name, key_prefix, key_hash, scopes, expires_at }) => {
  const result = await db.query(
    `INSERT INTO api_keys (org_id, user_id, name, key_prefix, key_hash, scopes, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, key_prefix, scopes, expires_at, created_at`,
    [org_id, user_id, name, key_prefix, key_hash, scopes, expires_at]
  );
  return result.rows[0];
};

// Get all keys for an org (never return hash)
export const getOrgApiKeys = async (org_id) => {
  const result = await db.query(
    `SELECT id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at
     FROM api_keys
     WHERE org_id = $1
     ORDER BY created_at DESC`,
    [org_id]
  );
  return result.rows;
};

// Find key by hash (used during authentication)
export const findApiKeyByHash = async (key_hash) => {
  const result = await db.query(
    `SELECT * FROM api_keys
     WHERE key_hash = $1
       AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > NOW())`,
    [key_hash]
  );
  return result.rows[0];
};

// Update last used timestamp
export const updateLastUsed = async (id) => {
  await db.query(
    `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
    [id]
  );
};

// Revoke (deactivate) a key
export const revokeApiKey = async (id, org_id) => {
  await db.query(
    `UPDATE api_keys SET is_active = FALSE WHERE id = $1 AND org_id = $2`,
    [id, org_id]
  );
};