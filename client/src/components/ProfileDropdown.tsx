import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProfileDropdownProps {
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
    toast.success(`Switched to ${!isDark ? 'Dark' : 'Light'} mode`);
  };

  const accuracy = user.totalSubmissions > 0
    ? Math.round(((user.successfulSubmissions || 0) / user.totalSubmissions) * 100)
    : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border-line hover:border-text-primary/40 bg-surface-card transition-all duration-150 cursor-pointer text-left"
        aria-label="User Profile Menu"
      >
        <div className="h-6 w-6 rounded-md bg-surface-subtle border border-border-line flex items-center justify-center overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-xs font-normal text-text-primary">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="hidden sm:block">
          <p className="text-[12px] font-medium text-text-primary truncate max-w-[120px]">
            {user.displayName || 'User'}
          </p>
        </div>

        <svg
          className={`h-3 w-3 text-text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-card border border-border-line rounded-xl shadow-card-hover overflow-hidden animate-faq-reveal z-50">
          {/* Header Stats */}
          <div className="p-4 bg-surface-subtle border-b border-border-line">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow-text text-[10px]">User Profile</span>
              <span className="text-[10px] font-mono text-status-green font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-1">
              <div>
                <span className="block font-serif text-lg text-text-primary leading-tight">
                  {user.totalScore || 0}
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase">
                  Score
                </span>
              </div>
              <div className="border-x border-border-line">
                <span className="block font-serif text-lg text-text-primary leading-tight">
                  {user.successfulSubmissions || 0}
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase">
                  Solved
                </span>
              </div>
              <div>
                <span className="block font-serif text-lg text-text-primary leading-tight">
                  {accuracy}%
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase">
                  Precision
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="p-2 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <span>Profile & History</span>
              <span className="font-mono text-xs text-text-muted">/&gt;</span>
            </Link>

            <Link
              to="/leaderboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <span>Leaderboard</span>
              <span className="font-mono text-xs text-text-muted">/&gt;</span>
            </Link>

            {/* In-menu Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-lg transition-colors cursor-pointer"
            >
              <span>Theme</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border-line bg-surface-card text-text-muted">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>

          <div className="p-2 border-t border-border-line">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <span>Sign Out</span>
              <span className="font-mono text-xs">-&gt;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
