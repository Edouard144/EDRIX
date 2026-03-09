import * as logsService from './logs.service.js';
import { sendSuccess } from '../../utils/response.js';

// POST /api/organizations/:orgId/logs
// Write a single log (or batch if array)
export const writeLogs = async (req, res, next) => {
  try {
    const { orgId } = req.params;

    // Accept single log or array of logs
    if (Array.isArray(req.body)) {
      await logsService.writeLogs(orgId, req.body);
      sendSuccess(res, {}, `${req.body.length} logs written`, 201);
    } else {
      const log = await logsService.writeLog(orgId, req.body);
      sendSuccess(res, { log }, 'Log written', 201);
    }
  } catch (err) { next(err); }
};

// GET /api/organizations/:orgId/logs
// Search + filter logs
export const searchLogs = async (req, res, next) => {
  try {
    // All filters come from query params:
    // ?level=error&source=auth&search=failed&from=2024-01-01&page=1&limit=20
    const result = await logsService.searchLogs(req.params.orgId, req.query);
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

// GET /api/organizations/:orgId/logs/stats
export const getLogStats = async (req, res, next) => {
  try {
    const { hours } = req.query;
    const stats = await logsService.getLogStats(req.params.orgId, hours);
    sendSuccess(res, { stats });
  } catch (err) { next(err); }
};