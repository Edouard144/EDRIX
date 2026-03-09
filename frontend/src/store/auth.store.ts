import { create } from 'zustand';

// Shape of the logged-in user
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
  setAuth: (user: User, token: string, refresh: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  // Called after successful login
  setAuth: (user, token, refresh) => {
    localStorage.setItem('edrix_token', token);
    localStorage.setItem('edrix_refresh', refresh);
    set({ user, token, isLoading: false });
  },

  // Called on logout
  clearAuth: () => {
    localStorage.removeItem('edrix_token');
    localStorage.removeItem('edrix_refresh');
    set({ user: null, token: null, isLoading: false });
  },
}));