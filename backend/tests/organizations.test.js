const BASE_URL = 'http://localhost:5000/api';
const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let token = '';
let orgId = '';
let inviteToken = '';

const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ed@test.com', password: 'secret123' }),
  });
  const data = await res.json();
  token = data.data.accessToken;
};

const auth = () => ({ Authorization: `Bearer ${token}` });

const testCreateOrg = async () => {
  const res = await fetch(`${BASE_URL}/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth() },
    body: JSON.stringify({ name: 'Luna AI' }),
  });
  const data = await res.json();
  if (data.success) { orgId = data.data.org.id; pass('Create org'); }
  else fail('Create org', data.message);
};

const testGetOrgs = async () => {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: auth(),
  });
  const data = await res.json();
  if (data.success && data.data.orgs.length > 0) pass('Get user orgs');
  else fail('Get user orgs', data.message);
};

const testGetMembers = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/members`, {
    headers: auth(),
  });
  const data = await res.json();
  if (data.success && data.data.members.length === 1) pass('Get members (owner only)');
  else fail('Get members', data.message);
};

const testInviteMember = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth() },
    body: JSON.stringify({ email: 'sara@test.com', role: 'member' }),
  });
  const data = await res.json();
  if (data.success) { inviteToken = data.data.invitation.token; pass('Invite member'); }
  else fail('Invite member', data.message);
};

const testGetAuditLog = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/audit-log`, {
    headers: auth(),
  });
  const data = await res.json();
  if (data.success && data.data.logs.length > 0) pass('Audit log');
  else fail('Audit log', data.message);
};

const run = async () => {
  console.log('\n🧪 Running organizations tests...\n');
  await login();
  await testCreateOrg();
  await testGetOrgs();
  await testGetMembers();
  await testInviteMember();
  await testGetAuditLog();
  console.log('\n✅ Done.\n');
};

run();