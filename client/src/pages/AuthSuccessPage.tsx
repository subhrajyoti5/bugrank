import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken, setSessionToken, refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const sessionToken = searchParams.get('sessionToken');

    const finalizeAuth = async () => {
      if (token && sessionToken) {
        // Store tokens in localStorage and context
        localStorage.setItem('bugrank_token', token);
        localStorage.setItem('bugrank_session', sessionToken);

        await setAuthToken(token);
        await setSessionToken(sessionToken);
        await refreshUser();

        // Redirect to problems page
        navigate('/problems', { replace: true });
      } else {
        // No tokens provided, redirect to login
        navigate('/login', { replace: true });
      }
    };

    void finalizeAuth();
  }, [searchParams, navigate, setAuthToken, setSessionToken, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-indigo mx-auto mb-4"></div>
        <p className="text-premium-muted">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
