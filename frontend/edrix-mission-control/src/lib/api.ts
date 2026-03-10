import axios from 'axios';

// Single axios instance — all API calls go through here
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token into every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edrix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear storage + redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Try refresh token once on 401
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('edrix_refresh');

      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            { refreshToken: refresh }
          );
          const newToken = data.data.accessToken;
          localStorage.setItem('edrix_token', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original); // retry original request
        } catch {
          // Refresh failed — log out
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
