import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import AuthSuccessPage from '@/pages/AuthSuccessPage';
import ProblemsPage from '@/pages/ProblemsPage';
import EditorPage from '@/pages/EditorPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ProfilePage from '@/pages/ProfilePage';
import LandingPage from '@/pages/LandingPage';
import { isAppSubdomain, isProduction, getAppUrl } from '@/utils/domain';
import '@/index.css';

// Automatically forwards production requests on bugrank.in for app routes over to app.bugrank.in
const DomainSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isApp = isAppSubdomain();
  const isProd = isProduction();
  const location = useLocation();

  useEffect(() => {
    // If visitor is on bugrank.in (landing domain) in production and reaches an app path, forward to app.bugrank.in
    if (!isApp && isProd) {
      const appPaths = ['/problems', '/editor', '/leaderboard', '/profile', '/login', '/auth-success'];
      if (appPaths.some(prefix => location.pathname.startsWith(prefix))) {
        window.location.replace(getAppUrl(location.pathname + location.search));
      }
    }
  }, [isApp, isProd, location.pathname, location.search]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const isApp = isAppSubdomain();

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <DomainSync>
            <Routes>
              {isApp ? (
                // ─────────────────────────────────────────────────────────────
                // APP SUBDOMAIN (app.bugrank.in)
                // Dedicated web application environment
                // ─────────────────────────────────────────────────────────────
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth-success" element={<AuthSuccessPage />} />

                  <Route
                    path="/editor/:id"
                    element={
                      <ProtectedRoute>
                        <EditorPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/problems" replace />} />
                    <Route
                      path="/problems"
                      element={
                        <ProtectedRoute>
                          <ProblemsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/leaderboard"
                      element={
                        <ProtectedRoute>
                          <LeaderboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  <Route path="*" element={<Navigate to="/problems" replace />} />
                </>
              ) : (
                // ─────────────────────────────────────────────────────────────
                // LANDING DOMAIN (bugrank.in / www.bugrank.in)
                // Dedicated marketing, SEO, and crawlable portal
                // ─────────────────────────────────────────────────────────────
                <>
                  <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />

                    {/* Localhost compatibility: allow browsing app pages in local dev */}
                    <Route
                      path="/problems"
                      element={
                        <ProtectedRoute>
                          <ProblemsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/leaderboard"
                      element={
                        <ProtectedRoute>
                          <LeaderboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth-success" element={<AuthSuccessPage />} />
                  <Route
                    path="/editor/:id"
                    element={
                      <ProtectedRoute>
                        <EditorPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </DomainSync>
        </BrowserRouter>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--surface-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-line)',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '0.88rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
