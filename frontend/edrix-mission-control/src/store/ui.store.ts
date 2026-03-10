import { create } from 'zustand';

interface Org {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface UIState {
  sidebarOpen: boolean;
  currentOrg: Org | null;
  orgs: Org[];

  toggleSidebar: () => void;
  setCurrentOrg: (org: Org) => void;
  setOrgs: (orgs: Org[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentOrg: null,
  orgs: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCurrentOrg: (org) => set({ currentOrg: org }),
  setOrgs: (orgs) => set({ orgs, currentOrg: orgs[0] || null }),
}));
