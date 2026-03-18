import { db } from '../../config/database.js';

// Get all jobs for an org with optional status filter
export const getJobsByOrg = async (orgId, { status, limit = 50, offset = 0 } = {}) => {
  let query = `
    SELECT j.*, u.email as creator_email
    FROM jobs j
    LEFT JOIN users u ON j.created_by = u.id
    WHERE j.org_id = $1
  `;
  const params = [orgId];
  let paramIndex = 2;

  if (status) {
    query += ` AND j.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  query += ` ORDER BY j.priority DESC, j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  return result.rows;
};

// Get a single job by ID
export const getJobById = async (orgId, jobId) => {
  const result = await db.query(
    `SELECT j.*, u.email as creator_email
     FROM jobs j
     LEFT JOIN users u ON j.created_by = u.id
     WHERE j.id = $1 AND j.org_id = $2`,
    [jobId, orgId]
  );
  return result.rows[0];
};

// Create a new job
export const createJob = async ({ orgId, projectId, name, payload, priority, scheduledAt, createdBy, maxAttempts = 3 }) => {
  const result = await db.query(
    `INSERT INTO jobs (org_id, project_id, name, payload, priority, scheduled_at, created_by, max_attempts)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [orgId, projectId, name, JSON.stringify(payload || {}), priority || 0, scheduledAt, createdBy, maxAttempts]
  );
  return result.rows[0];
};

// Update job status
export const updateJobStatus = async (orgId, jobId, { status, result, errorMessage, startedAt, completedAt }) => {
  const updates = [];
  const params = [orgId, jobId];
  let paramIndex = 3;

  if (status) {
    updates.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }
  if (result !== undefined) {
    updates.push(`result = $${paramIndex}`);
    params.push(JSON.stringify(result));
    paramIndex++;
  }
  if (errorMessage) {
    updates.push(`error_message = $${paramIndex}`);
    params.push(errorMessage);
    paramIndex++;
  }
  if (startedAt) {
    updates.push(`started_at = $${paramIndex}`);
    params.push(startedAt);
    paramIndex++;
  }
  if (completedAt) {
    updates.push(`completed_at = $${paramIndex}`);
    params.push(completedAt);
    paramIndex++;
  }

  if (updates.length === 0) return null;

  const query = `UPDATE jobs SET ${updates.join(', ')}, updated_at = NOW() WHERE org_id = $1 AND id = $2 RETURNING *`;
  const updateResult = await db.query(query, params);
  return updateResult.rows[0];
};

// Increment job attempts
export const incrementJobAttempts = async (orgId, jobId) => {
  const result = await db.query(
    `UPDATE jobs SET attempts = attempts + 1, updated_at = NOW() 
     WHERE org_id = $1 AND id = $2 RETURNING *`,
    [orgId, jobId]
  );
  return result.rows[0];
};

// Delete a job
export const deleteJob = async (orgId, jobId) => {
  const result = await db.query(
    `DELETE FROM jobs WHERE id = $1 AND org_id = $2 RETURNING *`,
    [jobId, orgId]
  );
  return result.rows[0];
};

// Get dead letter jobs
export const getDeadLetterJobs = async (orgId, { limit = 50, offset = 0 } = {}) => {
  const result = await db.query(
    `SELECT * FROM dead_letter_jobs 
     WHERE org_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [orgId, limit, offset]
  );
  return result.rows;
};

// Move job to dead letter queue
export const moveToDeadLetter = async (orgId, job, errorMessage) => {
  const result = await db.query(
    `INSERT INTO dead_letter_jobs (org_id, original_job_id, name, payload, error_message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [orgId, job.id, job.name, job.payload, errorMessage]
  );
  return result.rows[0];
};

// Retry a dead letter job (recreate as new job)
export const retryDeadLetterJob = async (orgId, deadLetterId, createdBy) => {
  // Get the dead letter job
  const dlResult = await db.query(
    `SELECT * FROM dead_letter_jobs WHERE id = $1 AND org_id = $2`,
    [deadLetterId, orgId]
  );
  const dlJob = dlResult.rows[0];
  if (!dlJob) return null;

  // Create a new job with the original payload
  const newJob = await createJob({
    orgId,
    name: dlJob.name,
    payload: dlJob.payload,
    createdBy,
    maxAttempts: 1 // Give it one more chance
  });

  // Delete from dead letter queue
  await db.query(
    `DELETE FROM dead_letter_jobs WHERE id = $1`,
    [deadLetterId]
  );

  return newJob;
};

// Get job counts by status
export const getJobCountsByStatus = async (orgId) => {
  const result = await db.query(
    `SELECT status, COUNT(*) as count 
     FROM jobs 
     WHERE org_id = $1 
     GROUP BY status`,
    [orgId]
  );
  return result.rows;
};
