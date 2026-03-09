import { db } from '../../config/database.js';

// Create a webhook
export const createWebhook = async ({ org_id, name, url, secret, events, created_by }) => {
  const result = await db.query(
    `INSERT INTO webhooks (org_id, name, url, secret, events, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, org_id, name, url, events, is_active, created_at`,
    [org_id, name, url, secret, events, created_by]
  );
  return result.rows[0];
};

// Get all webhooks for an org
export const getOrgWebhooks = async (org_id) => {
  const result = await db.query(
    `SELECT id, name, url, events, is_active, created_at
     FROM webhooks WHERE org_id = $1 ORDER BY created_at DESC`,
    [org_id]
  );
  return result.rows;
};

// Get one webhook by ID (includes secret for signing)
export const getWebhookById = async (id) => {
  const result = await db.query(
    `SELECT * FROM webhooks WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get all active webhooks listening to a specific event
export const getWebhooksForEvent = async (org_id, event) => {
  const result = await db.query(
    `SELECT * FROM webhooks
     WHERE org_id = $1
       AND is_active = TRUE
       AND (events @> $2 OR events @> ARRAY['*'])`,
    [org_id, [event]]
  );
  return result.rows;
};

// Update webhook
export const updateWebhook = async (id, { name, url, events, is_active }) => {
  const result = await db.query(
    `UPDATE webhooks
     SET name = COALESCE($1, name),
         url = COALESCE($2, url),
         events = COALESCE($3, events),
         is_active = COALESCE($4, is_active)
     WHERE id = $5
     RETURNING id, name, url, events, is_active`,
    [name, url, events, is_active, id]
  );
  return result.rows[0];
};

// Delete webhook
export const deleteWebhook = async (id, org_id) => {
  await db.query(
    `DELETE FROM webhooks WHERE id = $1 AND org_id = $2`,
    [id, org_id]
  );
};

// Create a delivery record
export const createDelivery = async ({ webhook_id, org_id, event, payload }) => {
  const result = await db.query(
    `INSERT INTO webhook_deliveries (webhook_id, org_id, event, payload)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [webhook_id, org_id, event, JSON.stringify(payload)]
  );
  return result.rows[0];
};

// Update delivery after attempt
export const updateDelivery = async (id, { status, response_status, response_body, next_retry_at, delivered_at }) => {
  await db.query(
    `UPDATE webhook_deliveries
     SET status = $1,
         response_status = $2,
         response_body = $3,
         attempts = attempts + 1,
         next_retry_at = $4,
         delivered_at = $5
     WHERE id = $6`,
    [status, response_status, response_body, next_retry_at, delivered_at, id]
  );
};

// Get pending deliveries due for retry
export const getPendingDeliveries = async () => {
  const result = await db.query(
    `SELECT d.*, w.url, w.secret
     FROM webhook_deliveries d
     JOIN webhooks w ON w.id = d.webhook_id
     WHERE d.status = 'pending'
       AND (d.next_retry_at IS NULL OR d.next_retry_at <= NOW())
       AND d.attempts < 5
     ORDER BY d.created_at ASC
     LIMIT 10`
  );
  return result.rows;
};

// Get deliveries for a webhook
export const getWebhookDeliveries = async (webhook_id) => {
  const result = await db.query(
    `SELECT id, event, status, response_status, attempts, delivered_at, created_at
     FROM webhook_deliveries
     WHERE webhook_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [webhook_id]
  );
  return result.rows;
};