import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@bugrank/shared';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setAuthToken: (token: string) => Promise<void>;
  setSessionToken: (token: string) => Promise<void>;
  // Keep for backward compatibility
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('bugrank_token');
      const sessionToken = localStorage.getItem('bugrank_session');
      
      if (token || sessionToken) {
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'x-session-token': sessionToken || '',
            },
          });
          
          if (response.data.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('bugrank_token');
          localStorage.removeItem('bugrank_session');
          localStorage.removeItem('bugrank_user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (email: string, password: string, displayName?: string) => {
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
  };

  const login = async (email: string, password: string) => {
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
  };

  const signOut = async () => {
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
      
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  // Refresh user data from server
  const refreshUser = async () => {
    const token = localStorage.getItem('bugrank_token');
    const sessionToken = localStorage.getItem('bugrank_session');
    
    if (token || sessionToken) {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-session-token': sessionToken || '',
          },
        });
        
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('bugrank_user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  // Backward compatibility - redirect to login page
  const signInWithGoogle = async () => {
    toast.error('Please use email/password login');
  };

  // Set auth token and refresh user data
  const setAuthToken = async (token: string) => {
    localStorage.setItem('bugrank_token', token);
    localStorage.setItem('token', token);
    await refreshUser();
  };

  // Set session token
  const setSessionToken = async (token: string) => {
    localStorage.setItem('bugrank_session', token);
    localStorage.setItem('sessionToken', token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut, refreshUser, setAuthToken, setSessionToken, signInWithGoogle }}>
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
