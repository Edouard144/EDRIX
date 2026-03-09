import * as queries from './billing.queries.js';

// Unit prices per event type
// Easy to change as business grows
const UNIT_PRICES = {
  api_call:    0.000001, // $0.000001 per call  → 1M calls = $1
  job_minute:  0.0001,   // $0.0001 per minute  → 1000 min = $0.10
  log_written: 0.0000001,// almost free
  storage_gb:  0.02,     // $0.02 per GB/month
};

// ── GET PLANS
export const getPlans = async () => {
  return await queries.getAllPlans();
};

// ── GET SUBSCRIPTION
export const getSubscription = async (orgId) => {
  const sub = await queries.getOrgSubscription(orgId);
  if (!sub) {
    // Auto-create free plan subscription
    const freePlan = await queries.getPlanBySlug('free');
    return await queries.createSubscription({ org_id: orgId, plan_id: freePlan.id });
  }
  return sub;
};

// ── UPGRADE PLAN
export const changePlan = async (orgId, planSlug) => {
  const plan = await queries.getPlanBySlug(planSlug);
  if (!plan) {
    const error = new Error('Plan not found');
    error.statusCode = 404;
    throw error;
  }
  return await queries.updateSubscription(orgId, { plan_id: plan.id });
};

// ── RECORD USAGE (called internally throughout the app)
export const recordUsage = async (orgId, eventType, quantity = 1, metadata = {}) => {
  const unit_price = UNIT_PRICES[eventType] || 0;
  await queries.recordUsage({
    org_id: orgId,
    event_type: eventType,
    quantity,
    unit_price,
    metadata,
  });
};

// ── GET USAGE SUMMARY FOR CURRENT MONTH
export const getUsageSummary = async (orgId) => {
  // Current billing period: 1st of month to now
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = now;

  const [breakdown, total] = await Promise.all([
    queries.getUsageSummary(orgId, from, to),
    queries.getTotalSpend(orgId, from, to),
  ]);

  // Project end-of-month bill
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const projectedTotal = (total / daysPassed) * daysInMonth;

  return {
    period: { from, to },
    breakdown,
    total_spend: total.toFixed(4),
    projected_monthly: projectedTotal.toFixed(2),
  };
};

// ── GENERATE INVOICE for an org (run at end of month)
export const generateInvoice = async (orgId) => {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const periodEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const breakdown = await queries.getUsageSummary(orgId, periodStart, periodEnd);
  const total = await queries.getTotalSpend(orgId, periodStart, periodEnd);

  // Create invoice
  const invoice = await queries.createInvoice({
    org_id: orgId,
    amount_due: total.toFixed(2),
    period_start: periodStart,
    period_end: periodEnd,
    due_date: new Date(now.getFullYear(), now.getMonth(), 15), // due 15th of next month
  });

  // Add line items
  for (const item of breakdown) {
    await queries.addInvoiceItem({
      invoice_id: invoice.id,
      description: `${item.event_type} (${item.total_quantity} units)`,
      quantity: item.total_quantity,
      unit_price: UNIT_PRICES[item.event_type] || 0,
      total: parseFloat(item.total_cost).toFixed(4),
    });
  }

  return invoice;
};

// ── GET INVOICES
export const getInvoices = async (orgId) => {
  return await queries.getOrgInvoices(orgId);
};

// ── GET SINGLE INVOICE
export const getInvoice = async (invoiceId) => {
  return await queries.getInvoiceWithItems(invoiceId);
};