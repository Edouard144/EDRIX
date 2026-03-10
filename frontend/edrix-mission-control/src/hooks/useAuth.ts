import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const { setOrgs } = useUIStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);

    // Load orgs immediately after login
    const orgsRes = await api.get('/organizations');
    setOrgs(orgsRes.data.data.orgs);

    navigate('/overview');
  };

  const register = async (full_name: string, email: string, password: string) => {
    await api.post('/auth/register', { full_name, email, password });
    navigate('/login?registered=true');
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('edrix_refresh');
      if (refresh) await api.post('/auth/logout', { refreshToken: refresh });
    } catch { /* silent */ }
    clearAuth();
    navigate('/login');
  };

  return { user, isAuthenticated, login, register, logout };
};
