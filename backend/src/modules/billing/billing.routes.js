import { Router } from 'express';
import * as billingController from './billing.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/roles.middleware.js';

const router = Router({ mergeParams: true });

// Public — anyone can see plans (no auth required)
router.get('/plans', billingController.getPlans);

// All other routes require authentication
router.use(requireAuth);

// Org billing — owner only for sensitive stuff
router.get('/subscription',  requireRole('member'), billingController.getSubscription);
router.patch('/subscription', requireRole('owner'),  billingController.changePlan);
router.get('/usage',          requireRole('member'), billingController.getUsageSummary);
router.get('/invoices',       requireRole('admin'),  billingController.getInvoices);
router.get('/invoices/:invoiceId', requireRole('admin'), billingController.getInvoice);
router.post('/invoices/generate', requireRole('owner'),  billingController.generateInvoice);

export default router;