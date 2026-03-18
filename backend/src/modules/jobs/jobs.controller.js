import * as jobsService from './jobs.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

// Get all jobs for an organization
export const getJobs = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { status, limit, offset } = req.query;
    
    const jobs = await jobsService.getJobs(orgId, {
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    });
    
    return sendSuccess(res, { jobs }, 200);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

// Get a single job
export const getJob = async (req, res) => {
  try {
    const { orgId, jobId } = req.params;
    
    const job = await jobsService.getJob(orgId, jobId);
    
    return sendSuccess(res, { job }, 200);
  } catch (err) {
    return sendError(res, err.message, err.message === 'Job not found' ? 404 : 400);
  }
};

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { name, payload, priority, scheduledAt, projectId } = req.body;
    const createdBy = req.user?.id;
    
    if (!name) {
      return sendError(res, 'Job name is required', 400);
    }
    
    const job = await jobsService.createJob(orgId, {
      name,
      payload,
      priority,
      scheduledAt,
      projectId,
      createdBy
    });
    
    return sendSuccess(res, { job }, 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const { orgId, jobId } = req.params;
    
    await jobsService.deleteJob(orgId, jobId);
    
    return sendSuccess(res, { message: 'Job deleted' }, 200);
  } catch (err) {
    return sendError(res, err.message, err.message === 'Job not found' ? 404 : 400);
  }
};

// Get dead letter jobs
export const getDeadLetterJobs = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { limit, offset } = req.query;
    
    const jobs = await jobsService.getDeadLetterJobs(orgId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined
    });
    
    return sendSuccess(res, { jobs }, 200);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

// Retry a dead letter job
export const retryDeadLetterJob = async (req, res) => {
  try {
    const { orgId, jobId } = req.params;
    const createdBy = req.user?.id;
    
    const job = await jobsService.retryDeadLetterJob(orgId, jobId, createdBy);
    
    return sendSuccess(res, { job }, 201);
  } catch (err) {
    return sendError(res, err.message, err.message === 'Dead letter job not found' ? 404 : 400);
  }
};

// Get job statistics
export const getJobStats = async (req, res) => {
  try {
    const { orgId } = req.params;
    
    const stats = await jobsService.getJobStats(orgId);
    
    return sendSuccess(res, { stats }, 200);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};
