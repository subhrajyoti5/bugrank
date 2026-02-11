import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken, setSessionToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const sessionToken = searchParams.get('sessionToken');

    if (token && sessionToken) {
      // Store tokens in localStorage and context
      localStorage.setItem('token', token);
      localStorage.setItem('sessionToken', sessionToken);
      
      setAuthToken(token);
      setSessionToken(sessionToken);

      // Redirect to problems page
      navigate('/problems', { replace: true });
    } else {
      // No tokens provided, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setAuthToken, setSessionToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
