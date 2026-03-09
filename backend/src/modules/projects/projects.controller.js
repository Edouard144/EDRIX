import * as projectsService from './projects.service.js';
import { sendSuccess } from '../../utils/response.js';

export const createProject = async (req, res, next) => {
  try {
    const project = await projectsService.createProject(
      req.params.orgId, req.user.userId, req.body
    );
    sendSuccess(res, { project }, 'Project created', 201);
  } catch (err) { next(err); }
};

export const getOrgProjects = async (req, res, next) => {
  try {
    const projects = await projectsService.getOrgProjects(req.params.orgId);
    sendSuccess(res, { projects });
  } catch (err) { next(err); }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await projectsService.getProject(req.params.projectId);
    sendSuccess(res, { project });
  } catch (err) { next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectsService.deleteProject(req.params.projectId);
    sendSuccess(res, {}, 'Project deleted');
  } catch (err) { next(err); }
};

export const getEnvironments = async (req, res, next) => {
  try {
    const environments = await projectsService.getEnvironments(req.params.projectId);
    sendSuccess(res, { environments });
  } catch (err) { next(err); }
};

export const setEnvVariable = async (req, res, next) => {
  try {
    const variable = await projectsService.setEnvVariable(
      req.params.environmentId, req.body
    );
    sendSuccess(res, { variable }, 'Variable saved');
  } catch (err) { next(err); }
};

export const getEnvVariables = async (req, res, next) => {
  try {
    const variables = await projectsService.getEnvVariables(req.params.environmentId);
    sendSuccess(res, { variables });
  } catch (err) { next(err); }
};

export const deleteEnvVariable = async (req, res, next) => {
  try {
    await projectsService.deleteEnvVariable(req.params.environmentId, req.params.key);
    sendSuccess(res, {}, 'Variable deleted');
  } catch (err) { next(err); }
};