import { db } from '../../config/database.js';

// Create a new organization
export const createOrg = async ({ name, slug, owner_id }) => {
  const result = await db.query(
    `INSERT INTO organizations (name, slug, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, slug, owner_id]
  );
  return result.rows[0];
};

// Add a member to an org
export const addMember = async ({ org_id, user_id, role }) => {
  await db.query(
    `INSERT INTO org_members (org_id, user_id, role)
     VALUES ($1, $2, $3)`,
    [org_id, user_id, role]
  );
};

// Get all orgs a user belongs to
export const getUserOrgs = async (user_id) => {
  const result = await db.query(
    `SELECT o.*, m.role
     FROM organizations o
     JOIN org_members m ON m.org_id = o.id
     WHERE m.user_id = $1
     ORDER BY o.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get one org by ID
export const getOrgById = async (org_id) => {
  const result = await db.query(
    `SELECT * FROM organizations WHERE id = $1`,
    [org_id]
  );
  return result.rows[0];
};

// Get one org by slug
export const getOrgBySlug = async (slug) => {
  const result = await db.query(
    `SELECT * FROM organizations WHERE slug = $1`,
    [slug]
  );
  return result.rows[0];
};

// Get all members of an org
export const getOrgMembers = async (org_id) => {
  const result = await db.query(
    `SELECT u.id, u.full_name, u.email, u.avatar_url, m.role, m.joined_at
     FROM org_members m
     JOIN users u ON u.id = m.user_id
     WHERE m.org_id = $1
     ORDER BY m.joined_at ASC`,
    [org_id]
  );
  return result.rows;
};

// Get a specific member's role in an org
export const getMember = async (org_id, user_id) => {
  const result = await db.query(
    `SELECT * FROM org_members WHERE org_id = $1 AND user_id = $2`,
    [org_id, user_id]
  );
  return result.rows[0];
};

// Update a member's role
export const updateMemberRole = async (org_id, user_id, role) => {
  await db.query(
    `UPDATE org_members SET role = $1 WHERE org_id = $2 AND user_id = $3`,
    [role, org_id, user_id]
  );
};

// Remove a member from an org
export const removeMember = async (org_id, user_id) => {
  await db.query(
    `DELETE FROM org_members WHERE org_id = $1 AND user_id = $2`,
    [org_id, user_id]
  );
};

// Create an invitation
export const createInvitation = async ({ org_id, invited_by, email, role, token, expires_at }) => {
  const result = await db.query(
    `INSERT INTO invitations (org_id, invited_by, email, role, token, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [org_id, invited_by, email, role, token, expires_at]
  );
  return result.rows[0];
};

// Find invitation by token
export const findInvitation = async (token) => {
  const result = await db.query(
    `SELECT i.*, o.name as org_name
     FROM invitations i
     JOIN organizations o ON o.id = i.org_id
     WHERE i.token = $1 AND i.accepted_at IS NULL AND i.expires_at > NOW()`,
    [token]
  );
  return result.rows[0];
};

// Accept invitation
export const acceptInvitation = async (token) => {
  await db.query(
    `UPDATE invitations SET accepted_at = NOW() WHERE token = $1`,
    [token]
  );
};

// Write to audit log
export const writeAuditLog = async ({ org_id, user_id, action, metadata }) => {
  await db.query(
    `INSERT INTO org_audit_log (org_id, user_id, action, metadata)
     VALUES ($1, $2, $3, $4)`,
    [org_id, user_id, action, JSON.stringify(metadata || {})]
  );
};

// Get audit log for an org
export const getAuditLog = async (org_id) => {
  const result = await db.query(
    `SELECT a.*, u.full_name, u.email
     FROM org_audit_log a
     LEFT JOIN users u ON u.id = a.user_id
     WHERE a.org_id = $1
     ORDER BY a.created_at DESC
     LIMIT 100`,
    [org_id]
  );
  return result.rows;
};