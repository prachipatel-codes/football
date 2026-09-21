'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
  phone?: string;
  city?: string | null;
  avatarUrl?: string | null;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  cityFilter: string;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (u: Partial<User>) => void;
  logout: () => void;
  setCityFilter: (c: string) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      cityFilter: 'Vadodara',
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setUser: (u) => set({ user: get().user ? { ...get().user!, ...u } : null }),
      logout: () => set({ user: null, accessToken: null }),
      setCityFilter: (cityFilter) => set({ cityFilter }),
    }),
    { name: 'offside-auth' }
  )
);

// fetch wrapper with auto refresh
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const { accessToken, setAuth, user, logout } = useAuth.getState();
  const headers = new Headers(init.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'application/json');
  let res = await fetch(input, { ...init, headers, credentials: 'include' });
  if (res.status === 401 && user) {
    // try refresh
    const r = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    if (r.ok) {
      const data = await r.json();
      setAuth(data.user, data.accessToken);
      headers.set('Authorization', `Bearer ${data.accessToken}`);
      res = await fetch(input, { ...init, headers, credentials: 'include' });
    } else {
      logout();
    }
  }
  return res;
}
