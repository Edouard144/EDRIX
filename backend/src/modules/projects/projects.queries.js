import { db } from '../../config/database.js';

// Create project
export const createProject = async ({ org_id, name, slug, description, created_by }) => {
  const result = await db.query(
    `INSERT INTO projects (org_id, name, slug, description, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [org_id, name, slug, description, created_by]
  );
  return result.rows[0];
};

// Get all projects in an org
export const getOrgProjects = async (org_id) => {
  const result = await db.query(
    `SELECT p.*, u.full_name as created_by_name
     FROM projects p
     JOIN users u ON u.id = p.created_by
     WHERE p.org_id = $1
     ORDER BY p.created_at DESC`,
    [org_id]
  );
  return result.rows;
};

// Get one project by ID
export const getProjectById = async (id) => {
  const result = await db.query(
    `SELECT * FROM projects WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get project by slug inside an org
export const getProjectBySlug = async (org_id, slug) => {
  const result = await db.query(
    `SELECT * FROM projects WHERE org_id = $1 AND slug = $2`,
    [org_id, slug]
  );
  return result.rows[0];
};

// Delete project
export const deleteProject = async (id) => {
  await db.query(`DELETE FROM projects WHERE id = $1`, [id]);
};

// ── ENVIRONMENTS

// Create environment
export const createEnvironment = async ({ project_id, name, slug }) => {
  const result = await db.query(
    `INSERT INTO environments (project_id, name, slug)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [project_id, name, slug]
  );
  return result.rows[0];
};

// Get all environments for a project
export const getProjectEnvironments = async (project_id) => {
  const result = await db.query(
    `SELECT * FROM environments WHERE project_id = $1 ORDER BY created_at ASC`,
    [project_id]
  );
  return result.rows;
};

// ── ENV VARIABLES

// Set a variable (insert or update if key exists)
export const setEnvVariable = async ({ environment_id, key, value, is_secret }) => {
  const result = await db.query(
    `INSERT INTO env_variables (environment_id, key, value, is_secret)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (environment_id, key)
     DO UPDATE SET value = $3, updated_at = NOW()
     RETURNING *`,
    [environment_id, key, value, is_secret]
  );
  return result.rows[0];
};

// Get all variables for an environment
export const getEnvVariables = async (environment_id) => {
  const result = await db.query(
    `SELECT * FROM env_variables WHERE environment_id = $1 ORDER BY key ASC`,
    [environment_id]
  );
  return result.rows;
};

// Delete a variable
export const deleteEnvVariable = async (environment_id, key) => {
  await db.query(
    `DELETE FROM env_variables WHERE environment_id = $1 AND key = $2`,
    [environment_id, key]
  );
};