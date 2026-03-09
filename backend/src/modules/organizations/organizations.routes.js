import { Router } from 'express';
import * as orgsController from './organizations.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router();

// All routes require login
router.use(requireAuth);

router.post('/',                                          orgsController.createOrg);
router.get('/',                                           orgsController.getUserOrgs);
router.get('/:orgId',          requireRole('member'),     orgsController.getOrg);
router.get('/:orgId/members',  requireRole('member'),     orgsController.getMembers);
router.post('/:orgId/invite',  requireRole('admin'),      orgsController.inviteMember);
router.post('/accept-invite',                             orgsController.acceptInvitation);
router.patch('/:orgId/members/:userId', requireRole('admin'), orgsController.updateMemberRole);
router.delete('/:orgId/members/:userId', requireRole('admin'), orgsController.removeMember);
router.get('/:orgId/audit-log', requireRole('admin'),     orgsController.getAuditLog);

export default router;