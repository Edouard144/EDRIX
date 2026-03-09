import { getMember } from '../modules/organizations/organizations.queries.js';
import { sendError } from '../utils/response.js';

// Role hierarchy — higher number = more power
const ROLE_LEVEL = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
};

// Usage: requireRole('admin') — only admin and owner can pass
export const requireRole = (minRole) => async (req, res, next) => {
  try {
    const org_id = req.params.orgId;
    const user_id = req.user.userId;

    // Check if user is a member of this org
    const member = await getMember(org_id, user_id);
    if (!member) return sendError(res, 'Not a member of this organization', 403);

    // Check if their role is high enough
    if (ROLE_LEVEL[member.role] < ROLE_LEVEL[minRole]) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    req.member = member; // attach member info for controllers
    next();
  } catch (err) {
    next(err);
  }
};