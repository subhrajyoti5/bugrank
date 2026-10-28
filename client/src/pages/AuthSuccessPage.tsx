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
    <div className="min-h-screen flex items-center justify-center bg-canvas text-text-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-border-line border-t-text-primary mx-auto mb-4" />
        <p className="font-mono text-xs text-text-muted uppercase tracking-widest">
          Finalizing Operative Session...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
