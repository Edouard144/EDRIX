import { Router } from 'express';
import * as projectsController from './projects.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true }); // mergeParams gives access to :orgId

router.use(requireAuth);

// Project routes
router.post('/',                    requireRole('member'), projectsController.createProject);
router.get('/',                     requireRole('member'), projectsController.getOrgProjects);
router.get('/:projectId',           requireRole('member'), projectsController.getProject);
router.delete('/:projectId',        requireRole('admin'),  projectsController.deleteProject);

// Environment routes
router.get('/:projectId/environments',                        requireRole('member'), projectsController.getEnvironments);
router.get('/:projectId/environments/:environmentId/vars',    requireRole('member'), projectsController.getEnvVariables);
router.post('/:projectId/environments/:environmentId/vars',   requireRole('admin'),  projectsController.setEnvVariable);
router.delete('/:projectId/environments/:environmentId/vars/:key', requireRole('admin'), projectsController.deleteEnvVariable);

export default router;