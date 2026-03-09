const BASE_URL = 'http://localhost:5000/api';
const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let token = '';
let orgId = '';
let webhookId = '';

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

const testCreateWebhook = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/webhooks`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify({
      name: 'My App Hook',
      url: 'https://webhook.site/test', // use webhook.site to inspect
      events: ['user.created', 'job.failed'],
    }),
  });
  const data = await res.json();
  if (data.success && data.data.webhook.secret.startsWith('whsec_')) {
    webhookId = data.data.webhook.id;
    pass('Create webhook (secret generated)');
  } else fail('Create webhook', data.message);
};

const testListWebhooks = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/webhooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // Secret must NOT appear in list
  const noSecret = !data.data.webhooks[0]?.secret;
  if (data.success && noSecret) pass('List webhooks (secret hidden)');
  else fail('List webhooks', data.message);
};

const testDispatchEvent = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/webhooks/test`, {
    method: 'POST',
    headers: auth(),
  });
  const data = await res.json();
  if (data.success) pass('Test event dispatched');
  else fail('Test event dispatched', data.message);
};

const testGetDeliveries = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/webhooks/${webhookId}/deliveries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success) pass('Get deliveries');
  else fail('Get deliveries', data.message);
};

const testUpdateWebhook = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/webhooks/${webhookId}`, {
    method: 'PATCH',
    headers: auth(),
    body: JSON.stringify({ is_active: false }),
  });
  const data = await res.json();
  if (data.success && data.data.webhook.is_active === false) pass('Disable webhook');
  else fail('Disable webhook', data.message);
};

const run = async () => {
  console.log('\n🧪 Running webhooks tests...\n');
  await login();
  await getOrg();
  await testCreateWebhook();
  await testListWebhooks();
  await testDispatchEvent();
  await testGetDeliveries();
  await testUpdateWebhook();
  console.log('\n✅ Done.\n');
  console.log('💡 Run "npm run webhook-worker" to process deliveries\n');
};

run();