import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const LoginPage: React.FC = () => {
  const { user, loading, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-md border-2 border-border-line border-t-text-primary animate-spin mb-4" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Verifying Identity...
        </span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/problems" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-charcoal selection:text-offwhite dark:selection:bg-offwhite dark:selection:text-charcoal flex flex-col justify-between p-6 relative overflow-hidden transition-colors duration-200">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 grid-subtle-pattern opacity-40 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <span>&lt;-</span>
          <span>Return to Portal</span>
        </Link>

        <ThemeToggle showLabel />
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-8">
        
        {/* Brand Display */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 select-none">
            <div className="w-8 h-8 rounded-lg border border-border-line flex items-center justify-center bg-surface-card">
              <span className="font-serif text-base font-normal text-text-primary">β</span>
            </div>
            <span className="font-serif text-2xl tracking-[-0.03em] text-text-primary">
              Bug<span className="italic font-normal">Rank</span>
            </span>
          </Link>
          <p className="eyebrow-text text-[10px]">AUTHENTICATION GATEWAY</p>
        </div>

        {/* Card Box - Rectangular with rounded corners */}
        <div className="card-frame-xl p-8 sm:p-9 bg-surface-card border border-border-line">
          
          <div className="mb-6 text-center sm:text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-text-primary mb-1.5">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-xs text-text-secondary">
              {isRegister
                ? 'Register your profile to begin diagnostic benchmarking.'
                : 'Enter your credentials to access missions.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block font-mono">
                  Username
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border-line rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary transition-colors font-sans"
                  placeholder="hunter"
                  required={isRegister}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block font-mono">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border-line rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary transition-colors font-sans"
                placeholder="engineer@bugrank.in"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider font-mono">
                  Password
                </label>
                {!isRegister && (
                  <span className="text-[11px] text-text-muted hover:text-text-primary transition-colors cursor-pointer font-mono">
                    Forgot?
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border-line rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary transition-colors font-sans"
                placeholder="••••••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-2.5 text-sm mt-2 rounded-lg cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}</span>
              <span className="ml-2 font-mono text-xs">-&gt;</span>
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-6 pt-5 border-t border-border-line">
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
              className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-2.5 rounded-lg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </a>
          </div>

          {/* Toggle Register/Login */}
          <div className="mt-5 text-center text-xs text-text-secondary">
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-text-primary font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-text-primary font-semibold hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-text-muted py-2 relative z-10 font-mono">
        PROTECTED BY BUGRANK SECURITY PROTOCOLS / V2.4
      </div>

    </div>
  );
};

export default LoginPage;
