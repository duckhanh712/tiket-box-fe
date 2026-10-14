'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore, UNAUTHORIZED_EVENT } from './api';
import type { AuthResponse, User } from './types';

interface AuthContextValue {
  user: User | null;
  /** false until the stored token has been checked on first load */
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    setUser(await api<User>('/users/me'));
  }, []);

  useEffect(() => {
    if (!tokenStore.get()) {
      setReady(true);
      return;
    }
    refreshUser()
      .catch(logout)
      .finally(() => setReady(true));
  }, [refreshUser, logout]);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const handleAuth = (res: AuthResponse) => {
    tokenStore.set(res.accessToken);
    setUser(res.user);
  };

  const login = async (email: string, password: string) => {
    handleAuth(await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }));
  };

  const register = async (fullName: string, email: string, password: string) => {
    handleAuth(
      await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: { fullName, email, password },
      }),
    );
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
