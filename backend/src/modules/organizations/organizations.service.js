import * as queries from './organizations.queries.js';
import { generateSecureToken } from '../../utils/crypto.js';
import { findUserByEmail } from '../auth/auth.queries.js';

// Generate slug from org name: "Luna AI" → "luna-ai"
const slugify = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── CREATE ORG
export const createOrg = async (userId, { name }) => {
  const slug = slugify(name);

  // Check slug not taken
  const existing = await queries.getOrgBySlug(slug);
  if (existing) {
    const error = new Error('Organization name already taken');
    error.statusCode = 409;
    throw error;
  }

  // Create org
  const org = await queries.createOrg({ name, slug, owner_id: userId });

  // Auto-add creator as owner
  await queries.addMember({ org_id: org.id, user_id: userId, role: 'owner' });

  // Log it
  await queries.writeAuditLog({
    org_id: org.id,
    user_id: userId,
    action: 'org.created',
    metadata: { name },
  });

  return org;
};

// ── GET USER'S ORGS
export const getUserOrgs = async (userId) => {
  return await queries.getUserOrgs(userId);
};

// ── GET ORG DETAILS
export const getOrg = async (orgId) => {
  const org = await queries.getOrgById(orgId);
  if (!org) {
    const error = new Error('Organization not found');
    error.statusCode = 404;
    throw error;
  }
  return org;
};

// ── GET MEMBERS
export const getMembers = async (orgId) => {
  return await queries.getOrgMembers(orgId);
};

// ── INVITE MEMBER
export const inviteMember = async (orgId, invitedBy, { email, role }) => {
  const token = generateSecureToken();
  const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  const invitation = await queries.createInvitation({
    org_id: orgId,
    invited_by: invitedBy,
    email,
    role,
    token,
    expires_at,
  });

  // TODO: send invitation email
  console.log(`📧 Invite token for ${email}: ${token}`);

  await queries.writeAuditLog({
    org_id: orgId,
    user_id: invitedBy,
    action: 'member.invited',
    metadata: { email, role },
  });

  return invitation;
};

// ── ACCEPT INVITATION
export const acceptInvitation = async (token, userId) => {
  const invitation = await queries.findInvitation(token);
  if (!invitation) {
    const error = new Error('Invalid or expired invitation');
    error.statusCode = 400;
    throw error;
  }

  // Check user isn't already a member
  const existing = await queries.getMember(invitation.org_id, userId);
  if (existing) {
    const error = new Error('Already a member');
    error.statusCode = 409;
    throw error;
  }

  await queries.addMember({ org_id: invitation.org_id, user_id: userId, role: invitation.role });
  await queries.acceptInvitation(token);

  await queries.writeAuditLog({
    org_id: invitation.org_id,
    user_id: userId,
    action: 'member.joined',
    metadata: { via: 'invitation' },
  });

  return invitation;
};

// ── UPDATE MEMBER ROLE
export const updateMemberRole = async (orgId, actorId, targetUserId, role) => {
  // Can't change owner role
  if (role === 'owner') {
    const error = new Error('Cannot assign owner role');
    error.statusCode = 400;
    throw error;
  }

  await queries.updateMemberRole(orgId, targetUserId, role);

  await queries.writeAuditLog({
    org_id: orgId,
    user_id: actorId,
    action: 'member.role_updated',
    metadata: { target: targetUserId, new_role: role },
  });
};

// ── REMOVE MEMBER
export const removeMember = async (orgId, actorId, targetUserId) => {
  // Can't remove yourself if you're the owner
  if (actorId === targetUserId) {
    const error = new Error('Cannot remove yourself');
    error.statusCode = 400;
    throw error;
  }

  await queries.removeMember(orgId, targetUserId);

  await queries.writeAuditLog({
    org_id: orgId,
    user_id: actorId,
    action: 'member.removed',
    metadata: { target: targetUserId },
  });
};

// ── GET AUDIT LOG
export const getAuditLog = async (orgId) => {
  return await queries.getAuditLog(orgId);
};