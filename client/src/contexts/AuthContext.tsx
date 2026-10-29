import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from '@bugpulse/shared';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setAuthToken: (token: string) => Promise<User | null>;
  setSessionToken: (token: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously restore cached user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('bugrank_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const hasToken = localStorage.getItem('bugrank_token') || localStorage.getItem('token');
    const hasUser = localStorage.getItem('bugrank_user');
    return Boolean(hasToken && !hasUser);
  });

  // Share in-flight request promise across simultaneous calls to prevent duplicate /api/auth/me requests
  const inFlightPromiseRef = useRef<Promise<User | null> | null>(null);

  // Core user fetcher that deduplicates requests
  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (inFlightPromiseRef.current) {
      return inFlightPromiseRef.current;
    }

    const token = localStorage.getItem('bugrank_token') || localStorage.getItem('token');
    const sessionToken = localStorage.getItem('bugrank_session') || localStorage.getItem('sessionToken');

    if (!token && !sessionToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    const requestPromise = (async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-session-token': sessionToken || '',
          },
          timeout: 15000,
        });

        const fetchedUser: User | null = response.data?.user || null;
        if (fetchedUser) {
          setUser(fetchedUser);
          localStorage.setItem('bugrank_user', JSON.stringify(fetchedUser));
        }
        return fetchedUser;
      } catch (error) {
        console.error('Failed to verify session:', error);
        localStorage.removeItem('bugrank_token');
        localStorage.removeItem('bugrank_session');
        localStorage.removeItem('bugrank_user');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionToken');
        setUser(null);
        return null;
      } finally {
        inFlightPromiseRef.current = null;
        setLoading(false);
      }
    })();

    inFlightPromiseRef.current = requestPromise;
    return requestPromise;
  }, []);

  // Run session check on initial mount once
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        displayName,
      });

      const { user: newUser, token, sessionToken } = response.data;

      setUser(newUser);
      localStorage.setItem('bugrank_user', JSON.stringify(newUser));
      localStorage.setItem('bugrank_token', token);
      localStorage.setItem('bugrank_session', sessionToken);

      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to register';
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user: loggedInUser, token, sessionToken } = response.data;

      setUser(loggedInUser);
      localStorage.setItem('bugrank_user', JSON.stringify(loggedInUser));
      localStorage.setItem('bugrank_token', token);
      localStorage.setItem('bugrank_session', sessionToken);

      toast.success('Logged in successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to login';
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const sessionToken = localStorage.getItem('bugrank_session');

      if (sessionToken) {
        await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            headers: {
              'x-session-token': sessionToken,
            },
          }
        );
      }

      setUser(null);
      localStorage.removeItem('bugrank_user');
      localStorage.removeItem('bugrank_token');
      localStorage.removeItem('bugrank_session');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionToken');

      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  }, []);

  // Backward compatibility
  const signInWithGoogle = useCallback(async () => {
    toast.error('Please use email/password login');
  }, []);

  // Set auth token and fetch user
  const setAuthToken = useCallback(
    async (token: string): Promise<User | null> => {
      localStorage.setItem('bugrank_token', token);
      localStorage.setItem('token', token);
      return await refreshUser();
    },
    [refreshUser]
  );

  // Set session token
  const setSessionToken = useCallback(async (token: string) => {
    localStorage.setItem('bugrank_session', token);
    localStorage.setItem('sessionToken', token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        signOut,
        refreshUser,
        setAuthToken,
        setSessionToken,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
