import * as queries from './logs.queries.js';
import { CONSTANTS } from '../../config/constants.js';

// ── WRITE ONE LOG
export const writeLog = async (orgId, { project_id, level, message, metadata, source }) => {
  return await queries.writeLog({
    org_id: orgId,
    project_id,
    level: level || 'info',
    message,
    metadata,
    source,
  });
};

// ── WRITE MULTIPLE LOGS AT ONCE
export const writeLogs = async (orgId, entries) => {
  const prepared = entries.map((e) => ({ ...e, org_id: orgId }));
  await queries.writeLogs(prepared);
};

// ── SEARCH LOGS WITH FILTERS + PAGINATION
export const searchLogs = async (orgId, filters) => {
  const limit = Math.min(filters.limit || 50, CONSTANTS.MAX_PAGE_SIZE);
  const page  = Math.max(filters.page || 1, 1);
  const offset = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    queries.searchLogs({ org_id: orgId, ...filters, limit, offset }),
    queries.countLogs({ org_id: orgId, ...filters }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// ── GET STATS FOR DASHBOARD
export const getLogStats = async (orgId, hours) => {
  const rows = await queries.getLogStats(orgId, hours || 24);

  // Format into a clean object: { info: 120, error: 5, warn: 12, debug: 0 }
  const stats = { info: 0, warn: 0, error: 0, debug: 0 };
  rows.forEach((r) => { stats[r.level] = parseInt(r.count); });
  return stats;
};