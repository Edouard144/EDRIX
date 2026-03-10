import { create } from 'zustand';

interface AuthState {
  user: { name: string; email: string; avatar?: string } | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string) => set({
    isAuthenticated: true,
    user: { name: email.split('@')[0], email, avatar: undefined },
  }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
