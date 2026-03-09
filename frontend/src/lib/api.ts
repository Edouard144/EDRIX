import axios from 'axios';

// Single axios instance — all API calls go through here
// Base URL from env, auth token injected automatically
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token into every request automatically
api.interceptors.request.use((config) => {
  // Read token from localStorage
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('edrix_token')
    : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('edrix_token');
      localStorage.removeItem('edrix_refresh');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;