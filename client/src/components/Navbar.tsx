import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/problems', label: 'Missions' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-canvas/92 backdrop-blur-md border-border-line shadow-sm'
          : 'bg-canvas/80 backdrop-blur-sm border-border-line'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo - GFS Didot Serif */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 rounded-lg border border-border-line flex items-center justify-center bg-surface-card">
            <span className="font-serif text-base font-normal text-text-primary leading-none">β</span>
          </div>
          <span className="font-serif text-2xl tracking-[-0.03em] text-text-primary">
            Bug<span className="italic font-normal">Rank</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ path, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`text-[0.93rem] transition-colors duration-150 relative py-1 ${
                  active
                    ? 'text-text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary font-normal'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-text-primary rounded" />
                )}
              </Link>
            );
          })}

          <a
            href="/#features"
            className="text-[0.93rem] text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            Capabilities
          </a>
          <a
            href="/#faq"
            className="text-[0.93rem] text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            FAQ
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switch */}
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3 ml-1">
              <ProfileDropdown onLogout={signOut} />
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex px-3.5 py-2 text-[0.9rem] rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-[0.88rem] py-2 px-4 sm:px-5 rounded-lg cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle - Clean Minimal SVG */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg border border-border-line hover:border-text-primary transition-colors ml-1 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-border-line bg-canvas/98 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in shadow-lg">
          <div className="space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between p-3 rounded-lg text-[0.93rem] transition-colors ${
                  isActive(path)
                    ? 'bg-surface-card text-text-primary font-semibold border border-border-line'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                }`}
              >
                <span>{label}</span>
                <span className="font-mono text-xs text-text-muted">/&gt;</span>
              </Link>
            ))}

            <a
              href="/#features"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg text-[0.93rem] text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
            >
              <span>Capabilities</span>
              <span className="font-mono text-xs text-text-muted">/&gt;</span>
            </a>

            <a
              href="/#faq"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg text-[0.93rem] text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
            >
              <span>FAQ</span>
              <span className="font-mono text-xs text-text-muted">/&gt;</span>
            </a>
          </div>

          {!user && (
            <div className="pt-4 border-t border-border-line flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full btn-primary py-2.5 text-sm rounded-lg"
              >
                Launch Console
              </button>
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full btn-secondary py-2.5 text-sm rounded-lg"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
