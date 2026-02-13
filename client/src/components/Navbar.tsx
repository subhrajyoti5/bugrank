import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, Trophy, Code2, Menu, X } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/problems', icon: Code2, label: 'Problems' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-electric-indigo/10 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-indigo/5 to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo Section */}
        <Link to="/problems" className="flex items-center gap-2 group relative">
          <div className="absolute -inset-2 bg-electric-indigo/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Bug className="h-5 w-5 text-premium-text group-hover:text-cyan-violet transition-colors" />
          </div>
          <span className="text-lg font-bold text-premium-text tracking-tight">
            Bug<span className="text-electric-indigo drop-shadow-[0_0_10px_rgba(80,80,200,0.5)]">Rank</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop (Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden group ${isActive(path)
                ? 'text-premium-text'
                : 'text-premium-muted hover:text-premium-text hover:bg-premium-slate/20'
                }`}
            >
              {isActive(path) && (
                <div className="absolute inset-0 bg-electric-indigo/10 border border-electric-indigo/20 rounded-full shadow-[0_0_15px_rgba(80,80,200,0.1)]" />
              )}
              <Icon className={`h-3.5 w-3.5 relative z-10 ${isActive(path) ? 'text-electric-indigo' : 'group-hover:text-electric-indigo/80 transition-colors'}`} />
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section: User & Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            className="md:hidden p-2 hover:bg-premium-slate/20 rounded-lg transition-colors text-premium-muted hover:text-premium-text"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-electric-indigo/10">
              {/* Profile Dropdown */}
              <ProfileDropdown onLogout={signOut} />
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-electric-indigo hover:bg-cyan-violet text-premium-text font-medium text-sm transition-all hover:shadow-[0_0_20px_rgba(80,80,200,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-xl border-b border-electric-indigo/10 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive(path)
                    ? 'bg-premium-slate/20 text-premium-text border border-electric-indigo/20'
                    : 'text-premium-muted hover:text-premium-text hover:bg-premium-slate/10'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive(path) ? 'text-electric-indigo' : 'group-hover:text-electric-indigo/80'}`} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
