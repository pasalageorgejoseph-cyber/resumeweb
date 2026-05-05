'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  username: string;
  email?: string;
  token?: string; // Kept for legacy fallback, but rely on cookies natively
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validate session automatically hitting the HTTPOnly secure cookie
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error('Session validation failed');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    router.push('/');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'DELETE' }); // Destroy Cookie securely
    } catch {}
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('resume-forge-data-v2'); // Purge active workspace cache strictly
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
