import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentOrg: string | null;
  toggleSidebar: () => void;
  setCurrentOrg: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentOrg: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCurrentOrg: (id) => set({ currentOrg: id }),
}));