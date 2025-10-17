import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types/nivafy';

export interface AuthUser {
  id: string;
  cellphone: string;
  username: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthStore {
  // State
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user?: AuthUser, refreshToken?: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  updateToken: (token: string) => void;
  getRefreshToken: () => string | null;
  
  // Role helpers
  isAdmin: () => boolean;
  isGod: () => boolean;
  hasRole: (minRole: UserRole) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // Actions
      setAuth: (token, user, refreshToken) =>
        set({
          token,
          refreshToken: refreshToken || null,
          user: user || null,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      updateToken: (token) => set({ token, isAuthenticated: true }),

      getRefreshToken: () => {
        const state = get();
        return state.refreshToken;
      },

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      
      // Role helpers
      isAdmin: () => {
        const state = get();
        return state.user ? state.user.role >= UserRole.ADMIN : false;
      },
      
      isGod: () => {
        const state = get();
        return state.user?.role === UserRole.GOD;
      },
      
      hasRole: (minRole: UserRole) => {
        const state = get();
        return state.user ? state.user.role >= minRole : false;
      },
    }),
    {
      name: 'litepanel-auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
