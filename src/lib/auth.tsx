'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './auth-api';

interface User {
  username: string;
  attributes: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, password: string, attributes?: Record<string, string>) => Promise<void>;
  confirmSignup: (username: string, confirmationCode: string) => Promise<void>;
  resendConfirmation: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token && refreshToken) {
      // Verify token is still valid by getting user profile
      authApi.getUserProfile()
        .then((userProfile) => {
          setUser(userProfile);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, try to refresh
          handleRefreshToken();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.refreshToken(refreshToken);
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.id_token) {
        localStorage.setItem('id_token', response.id_token);
      }

      // Get user profile with new token
      const userProfile = await authApi.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.id_token) {
        localStorage.setItem('id_token', response.id_token);
      }

      // Get user profile
      const userProfile = await authApi.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, attributes?: Record<string, string>) => {
    try {
      await authApi.signup(email, password, attributes);
      // Note: User needs to confirm signup before they can login
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const confirmSignup = async (username: string, confirmationCode: string) => {
    try {
      await authApi.confirmSignup(username, confirmationCode);
    } catch (error) {
      console.error('Signup confirmation failed:', error);
      throw error;
    }
  };

  const resendConfirmation = async (username: string) => {
    try {
      await authApi.resendConfirmationCode(username);
    } catch (error) {
      console.error('Resend confirmation failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const refreshTokenManual = async () => {
    await handleRefreshToken();
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated, 
      login, 
      signup,
      confirmSignup,
      resendConfirmation,
      logout, 
      loading,
      refreshToken: refreshTokenManual
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}