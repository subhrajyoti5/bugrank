import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@bugrank/shared';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-create demo user - no sign-in required
    const storedUser = localStorage.getItem('bugrank_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Automatically create demo user
      const mockUser: User = {
        id: 'demo-user',
        email: 'demo@bugrank.com',
        displayName: 'Demo User',
        photoURL: undefined,
        createdAt: new Date(),
        totalScore: 0,
        totalSubmissions: 0,
        successfulSubmissions: 0,
      };
      setUser(mockUser);
      localStorage.setItem('bugrank_user', JSON.stringify(mockUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Mock authentication - no Firebase
      const mockUser: User = {
        id: 'demo-user-' + Date.now(),
        email: 'demo@bugrank.com',
        displayName: 'Demo User',
        photoURL: undefined,
        createdAt: new Date(),
        totalScore: 0,
        totalSubmissions: 0,
        successfulSubmissions: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('bugrank_user', JSON.stringify(mockUser));
      toast.success('Signed in as Demo User!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('bugrank_user');
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
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
