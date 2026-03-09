import * as orgsService from './organizations.service.js';
import { sendSuccess } from '../../utils/response.js';

export const createOrg = async (req, res, next) => {
  try {
    const org = await orgsService.createOrg(req.user.userId, req.body);
    sendSuccess(res, { org }, 'Organization created', 201);
  } catch (err) { next(err); }
};

export const getUserOrgs = async (req, res, next) => {
  try {
    const orgs = await orgsService.getUserOrgs(req.user.userId);
    sendSuccess(res, { orgs });
  } catch (err) { next(err); }
};

export const getOrg = async (req, res, next) => {
  try {
    const org = await orgsService.getOrg(req.params.orgId);
    sendSuccess(res, { org });
  } catch (err) { next(err); }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await orgsService.getMembers(req.params.orgId);
    sendSuccess(res, { members });
  } catch (err) { next(err); }
};

export const inviteMember = async (req, res, next) => {
  try {
    const invitation = await orgsService.inviteMember(
      req.params.orgId, req.user.userId, req.body
    );
    sendSuccess(res, { invitation }, 'Invitation sent', 201);
  } catch (err) { next(err); }
};

export const acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await orgsService.acceptInvitation(token, req.user.userId);
    sendSuccess(res, { result }, 'Joined organization');
  } catch (err) { next(err); }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    await orgsService.updateMemberRole(
      req.params.orgId, req.user.userId, req.params.userId, req.body.role
    );
    sendSuccess(res, {}, 'Role updated');
  } catch (err) { next(err); }
};

export const removeMember = async (req, res, next) => {
  try {
    await orgsService.removeMember(
      req.params.orgId, req.user.userId, req.params.userId
    );
    sendSuccess(res, {}, 'Member removed');
  } catch (err) { next(err); }
};

export const getAuditLog = async (req, res, next) => {
  try {
    const logs = await orgsService.getAuditLog(req.params.orgId);
    sendSuccess(res, { logs });
  } catch (err) { next(err); }
};