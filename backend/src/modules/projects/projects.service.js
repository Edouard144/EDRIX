import * as queries from './projects.queries.js';

const slugify = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── CREATE PROJECT
export const createProject = async (orgId, userId, { name, description }) => {
  const slug = slugify(name);

  // Check slug not taken in this org
  const existing = await queries.getProjectBySlug(orgId, slug);
  if (existing) {
    const error = new Error('Project name already taken in this organization');
    error.statusCode = 409;
    throw error;
  }

  const project = await queries.createProject({
    org_id: orgId,
    name,
    slug,
    description,
    created_by: userId,
  });

  // Auto-create 3 default environments for every project
  await queries.createEnvironment({ project_id: project.id, name: 'Production', slug: 'production' });
  await queries.createEnvironment({ project_id: project.id, name: 'Staging', slug: 'staging' });
  await queries.createEnvironment({ project_id: project.id, name: 'Development', slug: 'development' });

  return project;
};

// ── GET ALL PROJECTS IN ORG
export const getOrgProjects = async (orgId) => {
  return await queries.getOrgProjects(orgId);
};

// ── GET ONE PROJECT
export const getProject = async (projectId) => {
  const project = await queries.getProjectById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Attach environments to project
  const environments = await queries.getProjectEnvironments(projectId);
  return { ...project, environments };
};

// ── DELETE PROJECT
export const deleteProject = async (projectId) => {
  await queries.deleteProject(projectId);
};

// ── GET ENVIRONMENTS
export const getEnvironments = async (projectId) => {
  return await queries.getProjectEnvironments(projectId);
};

// ── SET ENV VARIABLE
export const setEnvVariable = async (environmentId, { key, value, is_secret }) => {
  return await queries.setEnvVariable({
    environment_id: environmentId,
    key: key.toUpperCase(), // ENV vars are always uppercase: DATABASE_URL
    value,
    is_secret: is_secret || false,
  });
};

// ── GET ENV VARIABLES
// Mask secret values — never expose them in plain text
export const getEnvVariables = async (environmentId) => {
  const vars = await queries.getEnvVariables(environmentId);
  return vars.map((v) => ({
    ...v,
    value: v.is_secret ? '••••••••' : v.value, // hide secrets
  }));
};

// ── DELETE ENV VARIABLE
export const deleteEnvVariable = async (environmentId, key) => {
  await queries.deleteEnvVariable(environmentId, key.toUpperCase());
};