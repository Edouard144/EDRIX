import { Router } from 'express';
import * as webhooksController from './webhooks.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.post('/',                          requireRole('admin'),  webhooksController.createWebhook);
router.get('/',                           requireRole('member'), webhooksController.getOrgWebhooks);
router.patch('/:webhookId',               requireRole('admin'),  webhooksController.updateWebhook);
router.delete('/:webhookId',              requireRole('admin'),  webhooksController.deleteWebhook);
router.get('/:webhookId/deliveries',      requireRole('member'), webhooksController.getWebhookDeliveries);
router.post('/test',                      requireRole('admin'),  webhooksController.testWebhook);

export default router;