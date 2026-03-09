import { Router } from 'express';
import * as logsController from './logs.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.post('/',       requireRole('member'), logsController.writeLogs);
router.get('/',        requireRole('member'), logsController.searchLogs);
router.get('/stats',   requireRole('member'), logsController.getLogStats);

export default router;