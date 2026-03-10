import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_email_verified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string, refresh: string) => void;
  clearAuth: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('edrix_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('edrix_token'),

  // Called after login/register success
  setAuth: (user, token, refresh) => {
    localStorage.setItem('edrix_token', token);
    localStorage.setItem('edrix_refresh', refresh);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  // Called on logout
  clearAuth: () => {
    localStorage.removeItem('edrix_token');
    localStorage.removeItem('edrix_refresh');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Fetch current user from backend (called on app load)
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/users/me');
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('edrix_token');
      localStorage.removeItem('edrix_refresh');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
