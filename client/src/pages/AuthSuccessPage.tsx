import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSessionToken, setAuthToken } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const token = searchParams.get('token');
    const sessionToken = searchParams.get('sessionToken');

    if (!token && !sessionToken) {
      navigate('/login', { replace: true });
      return;
    }

    processedRef.current = true;

    const finalizeAuth = async () => {
      try {
        if (sessionToken) {
          await setSessionToken(sessionToken);
        }
        if (token) {
          const user = await setAuthToken(token);
          if (user) {
            navigate('/problems', { replace: true });
            return;
          }
        }

        // Fallback navigation
        navigate('/problems', { replace: true });
      } catch (error) {
        console.error('Finalize auth error:', error);
        navigate('/login', { replace: true });
      }
    };

    void finalizeAuth();
  }, [searchParams, navigate, setAuthToken, setSessionToken]);

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
