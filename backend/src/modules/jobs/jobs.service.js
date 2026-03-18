import * as jobsQueries from './jobs.queries.js';

// Get all jobs for an organization
export const getJobs = async (orgId, options = {}) => {
  const { status, limit = 50, offset = 0 } = options;
  const jobs = await jobsQueries.getJobsByOrg(orgId, { status, limit, offset });
  return jobs;
};

// Get a single job
export const getJob = async (orgId, jobId) => {
  const job = await jobsQueries.getJobById(orgId, jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  return job;
};

// Create a new job
export const createJob = async (orgId, data) => {
  const { name, payload, priority, scheduledAt, projectId, createdBy, maxAttempts } = data;
  
  const job = await jobsQueries.createJob({
    orgId,
    projectId,
    name,
    payload: payload || {},
    priority: priority || 0,
    scheduledAt,
    createdBy,
    maxAttempts
  });
  
  return job;
};

// Update job status
export const updateJobStatus = async (orgId, jobId, data) => {
  const { status, result, errorMessage, startedAt, completedAt } = data;
  
  const job = await jobsQueries.updateJobStatus(orgId, jobId, {
    status,
    result,
    errorMessage,
    startedAt,
    completedAt
  });
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  return job;
};

// Mark job as started
export const startJob = async (orgId, jobId) => {
  return updateJobStatus(orgId, jobId, {
    status: 'running',
    startedAt: new Date()
  });
};

// Mark job as completed
export const completeJob = async (orgId, jobId, result) => {
  return updateJobStatus(orgId, jobId, {
    status: 'completed',
    result,
    completedAt: new Date()
  });
};

// Mark job as failed
export const failJob = async (orgId, jobId, errorMessage) => {
  // Increment attempts
  const job = await jobsQueries.incrementJobAttempts(orgId, jobId);
  
  // Check if we've exceeded max attempts
  if (job.attempts >= job.max_attempts) {
    // Move to dead letter queue
    await jobsQueries.moveToDeadLetter(orgId, job, errorMessage);
    // Delete the original job
    await jobsQueries.deleteJob(orgId, jobId);
    return null;
  }
  
  // Otherwise mark as failed (can be retried)
  return updateJobStatus(orgId, jobId, {
    status: 'failed',
    errorMessage
  });
};

// Delete a job
export const deleteJob = async (orgId, jobId) => {
  const job = await jobsQueries.deleteJob(orgId, jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  return job;
};

// Get dead letter jobs
export const getDeadLetterJobs = async (orgId, options = {}) => {
  const { limit = 50, offset = 0 } = options;
  return jobsQueries.getDeadLetterJobs(orgId, { limit, offset });
};

// Retry a dead letter job
export const retryDeadLetterJob = async (orgId, deadLetterId, createdBy) => {
  const job = await jobsQueries.retryDeadLetterJob(orgId, deadLetterId, createdBy);
  if (!job) {
    throw new Error('Dead letter job not found');
  }
  return job;
};

// Get job counts by status
export const getJobStats = async (orgId) => {
  const counts = await jobsQueries.getJobCountsByStatus(orgId);
  
  // Transform into a more usable format
  const stats = {
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    total: 0
  };
  
  counts.forEach(({ status, count }) => {
    if (stats.hasOwnProperty(status)) {
      stats[status] = parseInt(count, 10);
    }
  });
  
  stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
  
  return stats;
};
