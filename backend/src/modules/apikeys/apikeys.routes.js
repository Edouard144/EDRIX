import { Router } from 'express';
import * as apikeysController from './apikeys.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.post('/',          requireRole('admin'),  apikeysController.createApiKey);
router.get('/',           requireRole('member'), apikeysController.getOrgApiKeys);
router.delete('/:keyId',  requireRole('admin'),  apikeysController.revokeApiKey);

export default router;