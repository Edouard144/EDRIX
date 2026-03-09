import { hashApiKey } from '../utils/crypto.js';
import { findApiKeyByHash, updateLastUsed } from '../modules/apikeys/apikeys.queries.js';
import { sendError } from '../utils/response.js';

// Checks the X-API-Key header for a valid API key
// Alternative to JWT — for programmatic/CLI access
export const requireApiKey = async (req, res, next) => {
  try {
    const rawKey = req.headers['x-api-key'];
    if (!rawKey) return sendError(res, 'API key required', 401);

    // Hash the incoming key and look it up
    const key_hash = hashApiKey(rawKey);
    const apiKey = await findApiKeyByHash(key_hash);

    if (!apiKey) return sendError(res, 'Invalid or expired API key', 401);

    // Update last used timestamp (non-blocking)
    updateLastUsed(apiKey.id);

    // Attach key info to request
    req.apiKey = apiKey;
    req.orgId = apiKey.org_id;

    next();
  } catch (err) {
    next(err);
  }
};