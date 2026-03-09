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

// Test: write single log
const testWriteLog = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify({ level: 'info', message: 'User signed up', source: 'auth', metadata: { email: 'sara@test.com' } }),
  });
  const data = await res.json();
  if (data.success) pass('Write single log');
  else fail('Write single log', data.message);
};

// Test: write batch logs
const testWriteBatchLogs = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify([
      { level: 'error', message: 'Database connection failed', source: 'worker' },
      { level: 'warn',  message: 'Rate limit approaching', source: 'api' },
      { level: 'info',  message: 'Job completed successfully', source: 'worker' },
    ]),
  });
  const data = await res.json();
  if (data.success) pass('Write batch logs');
  else fail('Write batch logs', data.message);
};

// Test: search all logs
const testSearchLogs = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success && data.data.logs.length > 0) pass('Search logs');
  else fail('Search logs', data.message);
};

// Test: filter by level
const testFilterByLevel = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs?level=error`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const allError = data.data.logs.every((l) => l.level === 'error');
  if (data.success && allError) pass('Filter by level=error');
  else fail('Filter by level', data.message);
};

// Test: search by keyword
const testSearchByKeyword = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs?search=Database`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success && data.data.logs.length > 0) pass('Search by keyword');
  else fail('Search by keyword', data.message);
};

// Test: get stats
const testGetStats = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/logs/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.success && typeof data.data.stats.info === 'number') pass('Get log stats');
  else fail('Get log stats', data.message);
};

const run = async () => {
  console.log('\n🧪 Running logs tests...\n');
  await login();
  await getOrg();
  await testWriteLog();
  await testWriteBatchLogs();
  await testSearchLogs();
  await testFilterByLevel();
  await testSearchByKeyword();
  await testGetStats();
  console.log('\n✅ Done.\n');
};

run();