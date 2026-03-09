const BASE_URL = 'http://localhost:5000/api';

const pass = (msg) => console.log(`✅ ${msg}`);
const fail = (msg, err) => console.log(`❌ ${msg}:`, err);

let accessToken = '';

// Login first to get token
const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ed@test.com', password: 'secret123' }),
  });
  const data = await res.json();
  accessToken = data.data.accessToken;
};

// Test: get profile without token (should fail)
const testNoToken = async () => {
  const res = await fetch(`${BASE_URL}/users/me`);
  const data = await res.json();
  if (!data.success && res.status === 401) pass('No token blocked');
  else fail('No token blocked', data.message);
};

// Test: get profile with valid token
const testGetProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (data.success && data.data.user.email) pass('Get profile');
  else fail('Get profile', data.message);
};

// Test: update profile
const testUpdateProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ full_name: 'Edouard EDRIX' }),
  });
  const data = await res.json();
  if (data.success && data.data.user.full_name === 'Edouard EDRIX') pass('Update profile');
  else fail('Update profile', data.message);
};

// Test: get sessions
const testGetSessions = async () => {
  const res = await fetch(`${BASE_URL}/users/me/sessions`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (data.success && Array.isArray(data.data.sessions)) pass('Get sessions');
  else fail('Get sessions', data.message);
};

const run = async () => {
  console.log('\n🧪 Running users tests...\n');
  await login();
  await testNoToken();
  await testGetProfile();
  await testUpdateProfile();
  await testGetSessions();
  console.log('\n✅ Done.\n');
};

run();