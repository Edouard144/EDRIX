import * as apikeysService from './apikeys.service.js';
import { sendSuccess } from '../../utils/response.js';

// POST /api/organizations/:orgId/api-keys
export const createApiKey = async (req, res, next) => {
  try {
    const apiKey = await apikeysService.createApiKey(
      req.params.orgId, req.user.userId, req.body
    );
    // Remind the user this is shown only once
    sendSuccess(res, { apiKey, warning: 'Save this key now. It will never be shown again.' }, 'API key created', 201);
  } catch (err) { next(err); }
};

// GET /api/organizations/:orgId/api-keys
export const getOrgApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await apikeysService.getOrgApiKeys(req.params.orgId);
    sendSuccess(res, { apiKeys });
  } catch (err) { next(err); }
};

// DELETE /api/organizations/:orgId/api-keys/:keyId
export const revokeApiKey = async (req, res, next) => {
  try {
    await apikeysService.revokeApiKey(req.params.orgId, req.params.keyId);
    sendSuccess(res, {}, 'API key revoked');
  } catch (err) { next(err); }
};