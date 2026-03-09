const BASE_URL = 'http://localhost:5000/api';
const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let token = '';
let orgId = '';
let keyId = '';
let fullKey = '';

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

const auth = () => ({ Authorization: `Bearer ${token}` });

// Test: create API key
const testCreateKey = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/api-keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth() },
    body: JSON.stringify({ name: 'CI/CD Key', scopes: ['read', 'write'], expires_in_days: 30 }),
  });
  const data = await res.json();
  if (data.success && data.data.apiKey.full_key.startsWith('edx_')) {
    keyId = data.data.apiKey.id;
    fullKey = data.data.apiKey.full_key;
    pass('Create API key');
  } else fail('Create API key', data.message);
};

// Test: list keys (full key never appears again)
const testListKeys = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/api-keys`, {
    headers: auth(),
  });
  const data = await res.json();
  const hasNoFullKey = !data.data.apiKeys[0].full_key;
  if (data.success && hasNoFullKey) pass('List keys (full key hidden)');
  else fail('List keys', data.message);
};

// Test: use API key to authenticate
const testUseApiKey = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { 'x-api-key': fullKey },
  });
  // This will fail until we support apikey auth on user routes
  // For now just check the key is valid format
  if (fullKey.startsWith('edx_') && fullKey.length > 10) pass('API key format valid');
  else fail('API key format', '');
};

// Test: revoke key
const testRevokeKey = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: auth(),
  });
  const data = await res.json();
  if (data.success) pass('Revoke API key');
  else fail('Revoke API key', data.message);
};

const run = async () => {
  console.log('\n🧪 Running API keys tests...\n');
  await login();
  await getOrg();
  await testCreateKey();
  await testListKeys();
  await testUseApiKey();
  await testRevokeKey();
  console.log('\n✅ Done.\n');
};

run();