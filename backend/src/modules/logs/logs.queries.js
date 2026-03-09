import { db } from '../../config/database.js';

// Write a single log entry
export const writeLog = async ({ org_id, project_id, level, message, metadata, source }) => {
  const result = await db.query(
    `INSERT INTO logs (org_id, project_id, level, message, metadata, source)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [org_id, project_id || null, level, message, JSON.stringify(metadata || {}), source || 'api']
  );
  return result.rows[0];
};

// Write multiple logs at once (bulk insert — much faster)
export const writeLogs = async (entries) => {
  if (!entries.length) return;

  // Build: ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12), ...
  const values = [];
  const params = [];

  entries.forEach((entry, i) => {
    const base = i * 6;
    values.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6})`);
    params.push(
      entry.org_id,
      entry.project_id || null,
      entry.level || 'info',
      entry.message,
      JSON.stringify(entry.metadata || {}),
      entry.source || 'api'
    );
  });

  await db.query(
    `INSERT INTO logs (org_id, project_id, level, message, metadata, source)
     VALUES ${values.join(', ')}`,
    params
  );
};

// Search + filter logs
export const searchLogs = async ({ org_id, level, source, project_id, search, from, to, limit, offset }) => {
  // Build query dynamically based on filters provided
  const conditions = ['org_id = $1'];
  const params = [org_id];
  let i = 2;

  if (level)      { conditions.push(`level = $${i++}`);                params.push(level); }
  if (source)     { conditions.push(`source = $${i++}`);               params.push(source); }
  if (project_id) { conditions.push(`project_id = $${i++}`);           params.push(project_id); }
  if (search)     { conditions.push(`message ILIKE $${i++}`);          params.push(`%${search}%`); }
  if (from)       { conditions.push(`created_at >= $${i++}`);          params.push(from); }
  if (to)         { conditions.push(`created_at <= $${i++}`);          params.push(to); }

  const where = conditions.join(' AND ');

  const result = await db.query(
    `SELECT * FROM logs
     WHERE ${where}
     ORDER BY created_at DESC
     LIMIT $${i++} OFFSET $${i++}`,
    [...params, limit || 50, offset || 0]
  );
  return result.rows;
};

// Count logs matching filters (for pagination)
export const countLogs = async ({ org_id, level, source, project_id, search, from, to }) => {
  const conditions = ['org_id = $1'];
  const params = [org_id];
  let i = 2;

  if (level)      { conditions.push(`level = $${i++}`);       params.push(level); }
  if (source)     { conditions.push(`source = $${i++}`);      params.push(source); }
  if (project_id) { conditions.push(`project_id = $${i++}`);  params.push(project_id); }
  if (search)     { conditions.push(`message ILIKE $${i++}`); params.push(`%${search}%`); }
  if (from)       { conditions.push(`created_at >= $${i++}`); params.push(from); }
  if (to)         { conditions.push(`created_at <= $${i++}`); params.push(to); }

  const result = await db.query(
    `SELECT COUNT(*) FROM logs WHERE ${conditions.join(' AND ')}`,
    params
  );
  return parseInt(result.rows[0].count);
};

// Get log stats for dashboard (count by level)
export const getLogStats = async (org_id, hours = 24) => {
  const result = await db.query(
    `SELECT level, COUNT(*) as count
     FROM logs
     WHERE org_id = $1
       AND created_at >= NOW() - INTERVAL '${hours} hours'
     GROUP BY level`,
    [org_id]
  );
  return result.rows;
};

// Delete logs older than X days (cleanup)
export const deleteOldLogs = async (org_id, days = 30) => {
  await db.query(
    `DELETE FROM logs
     WHERE org_id = $1
       AND created_at < NOW() - INTERVAL '${days} days'`,
    [org_id]
  );
};