const BASE_URL = 'http://localhost:5000/api';
const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let token = '';
let orgId = '';
let projectId = '';
let environmentId = '';

const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ed@test.com', password: 'secret123' }),
  });
  const data = await res.json();
  token = data.data.accessToken;
};

// Get the org created in previous test
const getOrg = async () => {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  orgId = data.data.orgs[0].id;
};

const auth = () => ({ Authorization: `Bearer ${token}` });

const testCreateProject = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth() },
    body: JSON.stringify({ name: 'API Service', description: 'Main backend API' }),
  });
  const data = await res.json();
  if (data.success) { projectId = data.data.project.id; pass('Create project'); }
  else fail('Create project', data.message);
};

const testGetProjects = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/projects`, {
    headers: auth(),
  });
  const data = await res.json();
  if (data.success && data.data.projects.length > 0) pass('Get projects');
  else fail('Get projects', data.message);
};

const testGetProject = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/projects/${projectId}`, {
    headers: auth(),
  });
  const data = await res.json();
  // Should have 3 auto-created environments
  if (data.success && data.data.project.environments.length === 3) pass('Get project with environments');
  else fail('Get project with environments', data.message);
};

const testGetEnvironments = async () => {
  const res = await fetch(`${BASE_URL}/organizations/${orgId}/projects/${projectId}/environments`, {
    headers: auth(),
  });
  const data = await res.json();
  if (data.success) { environmentId = data.data.environments[0].id; pass('Get environments'); }
  else fail('Get environments', data.message);
};

const testSetEnvVar = async () => {
  const res = await fetch(
    `${BASE_URL}/organizations/${orgId}/projects/${projectId}/environments/${environmentId}/vars`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify({ key: 'database_url', value: 'postgres://...', is_secret: true }),
    }
  );
  const data = await res.json();
  if (data.success) pass('Set env variable');
  else fail('Set env variable', data.message);
};

const testGetEnvVars = async () => {
  const res = await fetch(
    `${BASE_URL}/organizations/${orgId}/projects/${projectId}/environments/${environmentId}/vars`,
    { headers: auth() }
  );
  const data = await res.json();
  // Secret value should be masked
  const masked = data.data.variables[0].value === '••••••••';
  if (data.success && masked) pass('Get env variables (secrets masked)');
  else fail('Get env variables', data.message);
};

const run = async () => {
  console.log('\n🧪 Running projects tests...\n');
  await login();
  await getOrg();
  await testCreateProject();
  await testGetProjects();
  await testGetProject();
  await testGetEnvironments();
  await testSetEnvVar();
  await testGetEnvVars();
  console.log('\n✅ Done.\n');
};

run();