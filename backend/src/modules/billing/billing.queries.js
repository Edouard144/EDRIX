import { db } from '../../config/database.js';

// ── PLANS
export const getAllPlans = async () => {
  const result = await db.query(
    `SELECT * FROM plans WHERE is_active = TRUE ORDER BY price_monthly ASC`
  );
  return result.rows;
};

export const getPlanBySlug = async (slug) => {
  const result = await db.query(
    `SELECT * FROM plans WHERE slug = $1`,
    [slug]
  );
  return result.rows[0];
};

// ── SUBSCRIPTIONS
export const getOrgSubscription = async (org_id) => {
  const result = await db.query(
    `SELECT s.*, p.name as plan_name, p.slug as plan_slug,
            p.price_monthly, p.limits
     FROM subscriptions s
     JOIN plans p ON p.id = s.plan_id
     WHERE s.org_id = $1`,
    [org_id]
  );
  return result.rows[0];
};

export const createSubscription = async ({ org_id, plan_id }) => {
  const result = await db.query(
    `INSERT INTO subscriptions (org_id, plan_id)
     VALUES ($1, $2)
     ON CONFLICT (org_id) DO UPDATE SET plan_id = $2, status = 'active'
     RETURNING *`,
    [org_id, plan_id]
  );
  return result.rows[0];
};

export const updateSubscription = async (org_id, { plan_id, status }) => {
  const result = await db.query(
    `UPDATE subscriptions
     SET plan_id = COALESCE($1, plan_id),
         status = COALESCE($2, status)
     WHERE org_id = $3
     RETURNING *`,
    [plan_id, status, org_id]
  );
  return result.rows[0];
};

// ── USAGE EVENTS
// Record one usage event
export const recordUsage = async ({ org_id, event_type, quantity, unit_price, metadata }) => {
  await db.query(
    `INSERT INTO usage_events (org_id, event_type, quantity, unit_price, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [org_id, event_type, quantity || 1, unit_price || 0, JSON.stringify(metadata || {})]
  );
};

// Get usage summary for current billing period
export const getUsageSummary = async (org_id, from, to) => {
  const result = await db.query(
    `SELECT
       event_type,
       SUM(quantity) as total_quantity,
       SUM(quantity * unit_price) as total_cost
     FROM usage_events
     WHERE org_id = $1
       AND created_at >= $2
       AND created_at <= $3
     GROUP BY event_type
     ORDER BY total_cost DESC`,
    [org_id, from, to]
  );
  return result.rows;
};

// Get total spend for period
export const getTotalSpend = async (org_id, from, to) => {
  const result = await db.query(
    `SELECT COALESCE(SUM(quantity * unit_price), 0) as total
     FROM usage_events
     WHERE org_id = $1
       AND created_at >= $2
       AND created_at <= $3`,
    [org_id, from, to]
  );
  return parseFloat(result.rows[0].total);
};

// ── INVOICES
export const createInvoice = async ({ org_id, amount_due, period_start, period_end, due_date }) => {
  const result = await db.query(
    `INSERT INTO invoices (org_id, amount_due, period_start, period_end, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [org_id, amount_due, period_start, period_end, due_date]
  );
  return result.rows[0];
};

export const addInvoiceItem = async ({ invoice_id, description, quantity, unit_price, total }) => {
  await db.query(
    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total)
     VALUES ($1, $2, $3, $4, $5)`,
    [invoice_id, description, quantity, unit_price, total]
  );
};

export const getOrgInvoices = async (org_id) => {
  const result = await db.query(
    `SELECT * FROM invoices WHERE org_id = $1 ORDER BY created_at DESC`,
    [org_id]
  );
  return result.rows;
};

export const getInvoiceWithItems = async (id) => {
  const invoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
  const items = await db.query(`SELECT * FROM invoice_items WHERE invoice_id = $1`, [id]);
  return { ...invoice.rows[0], items: items.rows };
};

export const markInvoicePaid = async (id) => {
  await db.query(
    `UPDATE invoices
     SET status = 'paid', paid_at = NOW(), amount_paid = amount_due
     WHERE id = $1`,
    [id]
  );
};