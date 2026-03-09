const BASE_URL = 'http://localhost:5000/api';
const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let token = '';
let orgId = '';

const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ed@test.com', password: 'secret123' }),
  });
  const data = await res.json();
  token = data.data.accessToken;
};

const getOrg = async () => {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  orgId = data.data.orgs[0].id;
};

const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

const testGetPlans = async () => {
  const res = await fetch(`${BASE_URL}/billing/plans`);
  const data = await res.json();
  if (data.success && data.data.plans.length === 3) pass('Get plans (Free, Pro, Enterprise)');
  else fail('Get plans', data.message);
};

const testGetSubscription = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/billing/subscription`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // Auto-creates free plan if none exists
  if (data.success && data.data.subscription) pass('Get subscription (auto free plan)');
  else fail('Get subscription', data.message);
};

const testGetUsage = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/billing/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success && data.data.usage.projected_monthly !== undefined) pass('Get usage summary');
  else fail('Get usage', data.message);
};

const testUpgradePlan = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/billing/subscription`, {
    method: 'PATCH',
    headers: auth(),
    body: JSON.stringify({ plan: 'pro' }),
  });
  const data = await res.json();
  if (data.success) pass('Upgrade to Pro plan');
  else fail('Upgrade plan', data.message);
};

const testGenerateInvoice = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/billing/invoices/generate`, {
    method: 'POST',
    headers: auth(),
  });
  const data = await res.json();
  if (data.success) pass('Generate invoice');
  else fail('Generate invoice', data.message);
};

const testGetInvoices = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/billing/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success) pass('Get invoices');
  else fail('Get invoices', data.message);
};

const run = async () => {
  console.log('\n🧪 Running billing tests...\n');
  await login();
  await getOrg();
  await testGetPlans();
  await testGetSubscription();
  await testGetUsage();
  await testUpgradePlan();
  await testGenerateInvoice();
  await testGetInvoices();
  console.log('\n✅ Done.\n');
};

run();