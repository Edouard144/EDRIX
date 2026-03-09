import * as queries from './apikeys.queries.js';
import { generateApiKey, hashApiKey } from '../../utils/crypto.js';

// ── CREATE API KEY
export const createApiKey = async (orgId, userId, { name, scopes, expires_in_days }) => {
  // Generate the full key — shown to user ONCE, never again
  const fullKey = generateApiKey();

  // Hash it for storage
  const key_hash = hashApiKey(fullKey);

  // Save only the first 8 chars as prefix for display: "edx_a1b2..."
  const key_prefix = fullKey.substring(0, 8);

  // Calculate expiry if provided
  const expires_at = expires_in_days
    ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
    : null;

  const apiKey = await queries.createApiKey({
    org_id: orgId,
    user_id: userId,
    name,
    key_prefix,
    key_hash,
    scopes: scopes || ['read'],
    expires_at,
  });

  // Return full key HERE — this is the only time it's ever visible
  return { ...apiKey, full_key: fullKey };
};

// ── GET ALL KEYS
export const getOrgApiKeys = async (orgId) => {
  return await queries.getOrgApiKeys(orgId);
};

// ── REVOKE KEY
export const revokeApiKey = async (orgId, keyId) => {
  await queries.revokeApiKey(keyId, orgId);
};