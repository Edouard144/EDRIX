import * as queries from './webhooks.queries.js';
import { generateSecureToken } from '../../utils/crypto.js';
import { signPayload, getNextRetryAt } from '../../utils/webhook.js';

// ── CREATE WEBHOOK
export const createWebhook = async (orgId, userId, { name, url, events }) => {
  // Auto-generate a signing secret
  const secret = `whsec_${generateSecureToken()}`;

  const webhook = await queries.createWebhook({
    org_id: orgId,
    name,
    url,
    secret,
    events: events || ['*'], // * = listen to all events
    created_by: userId,
  });

  // Return secret once — developer must save it to verify signatures
  return { ...webhook, secret };
};

// ── GET ALL WEBHOOKS
export const getOrgWebhooks = async (orgId) => {
  return await queries.getOrgWebhooks(orgId);
};

// ── GET DELIVERIES FOR A WEBHOOK
export const getWebhookDeliveries = async (webhookId) => {
  return await queries.getWebhookDeliveries(webhookId);
};

// ── UPDATE WEBHOOK
export const updateWebhook = async (webhookId, body) => {
  return await queries.updateWebhook(webhookId, body);
};

// ── DELETE WEBHOOK
export const deleteWebhook = async (webhookId, orgId) => {
  await queries.deleteWebhook(webhookId, orgId);
};

// ── DISPATCH EVENT
// Called internally when something happens in EDRIX
// Example: dispatchEvent(orgId, 'user.created', { id, email })
export const dispatchEvent = async (orgId, event, payload) => {
  // Find all webhooks listening to this event
  const webhooks = await queries.getWebhooksForEvent(orgId, event);
  if (!webhooks.length) return;

  // Create a delivery record for each webhook
  for (const webhook of webhooks) {
    await queries.createDelivery({
      webhook_id: webhook.id,
      org_id: orgId,
      event,
      payload: {
        event,
        created_at: new Date().toISOString(),
        data: payload,
      },
    });
  }
};

// ── REPLAY A DELIVERY (manual retry from dashboard)
export const replayDelivery = async (deliveryId) => {
  await queries.updateDelivery(deliveryId, {
    status: 'pending',
    next_retry_at: new Date(),
    response_status: null,
    response_body: null,
    delivered_at: null,
  });
};