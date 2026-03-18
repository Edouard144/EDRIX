import { Router } from 'express';
import * as jobsController from './jobs.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/', requireRole('member'), jobsController.getJobs);
router.get('/dead-letter', requireRole('member'), jobsController.getDeadLetterJobs);
router.get('/stats', requireRole('member'), jobsController.getJobStats);
router.get('/:jobId', requireRole('member'), jobsController.getJob);
router.post('/', requireRole('member'), jobsController.createJob);
router.delete('/:jobId', requireRole('admin'), jobsController.deleteJob);
router.post('/:jobId/retry', requireRole('member'), jobsController.retryDeadLetterJob);

export default router;
