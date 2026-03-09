import * as webhooksService from './webhooks.service.js';
import { sendSuccess } from '../../utils/response.js';

export const createWebhook = async (req, res, next) => {
  try {
    const webhook = await webhooksService.createWebhook(
      req.params.orgId, req.user.userId, req.body
    );
    sendSuccess(res, { webhook, warning: 'Save the secret now. It will never be shown again.' }, 'Webhook created', 201);
  } catch (err) { next(err); }
};

export const getOrgWebhooks = async (req, res, next) => {
  try {
    const webhooks = await webhooksService.getOrgWebhooks(req.params.orgId);
    sendSuccess(res, { webhooks });
  } catch (err) { next(err); }
};

export const getWebhookDeliveries = async (req, res, next) => {
  try {
    const deliveries = await webhooksService.getWebhookDeliveries(req.params.webhookId);
    sendSuccess(res, { deliveries });
  } catch (err) { next(err); }
};

export const updateWebhook = async (req, res, next) => {
  try {
    const webhook = await webhooksService.updateWebhook(req.params.webhookId, req.body);
    sendSuccess(res, { webhook }, 'Webhook updated');
  } catch (err) { next(err); }
};

export const deleteWebhook = async (req, res, next) => {
  try {
    await webhooksService.deleteWebhook(req.params.webhookId, req.params.orgId);
    sendSuccess(res, {}, 'Webhook deleted');
  } catch (err) { next(err); }
};

// POST /api/organizations/:orgId/webhooks/test
// Manually fire a test event
export const testWebhook = async (req, res, next) => {
  try {
    await webhooksService.dispatchEvent(req.params.orgId, 'test.ping', {
      message: 'This is a test event from EDRIX',
      timestamp: new Date().toISOString(),
    });
    sendSuccess(res, {}, 'Test event dispatched');
  } catch (err) { next(err); }
};