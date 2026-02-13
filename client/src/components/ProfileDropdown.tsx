import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileDropdown: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or document state
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
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

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Toggle dark class on html element
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Switched to ${newTheme ? 'Dark' : 'Light'} mode`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-premium-slate/20 transition-all duration-200 border border-electric-indigo/10 hover:border-electric-indigo/20 group"
      >
        <div className="relative">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-electric-indigo to-cyan-violet ring-1 ring-electric-indigo/20 flex items-center justify-center overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-premium-text">{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-cyan border border-background rounded-full shadow-lg"></div>
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-premium-text group-hover:text-cyan-violet transition-colors">{user.displayName}</p>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-premium-muted transition-transform duration-300 group-hover:text-premium-text ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-premium-slate/80 backdrop-blur-xl border border-electric-indigo/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
          {/* Header Stats */}
          <div className="px-5 py-4 border-b border-electric-indigo/10 bg-gradient-to-r from-electric-indigo/10 to-cyan-violet/10">
            <p className="text-[10px] text-premium-muted uppercase font-bold tracking-widest mb-3">Quick Stats</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <span className="block text-xl font-black text-premium-text">{user.totalScore || 0}</span>
                <span className="text-[9px] text-premium-muted uppercase font-semibold tracking-wider">Points</span>
              </div>
              <div className="h-6 w-px bg-electric-indigo/10"></div>
              <div className="text-center">
                <span className="block text-xl font-black text-indigo-cyan">{user.successfulSubmissions || 0}</span>
                <span className="text-[9px] text-premium-muted uppercase font-semibold tracking-wider">Solved</span>
              </div>
              <div className="col-span-3 h-1 bg-electric-indigo/10 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-electric-indigo to-cyan-violet"
                  style={{
                    width: user.totalSubmissions > 0 
                      ? `${(user.successfulSubmissions || 0) / (user.totalSubmissions || 1) * 100}%` 
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-premium-text hover:bg-electric-indigo/10 hover:text-cyan-violet rounded-xl transition-all group"
            >
              <User className="h-4 w-4 text-premium-muted group-hover:text-electric-indigo" />
              <span className="font-medium">View Profile</span>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-premium-text hover:bg-electric-indigo/10 hover:text-cyan-violet rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="h-4 w-4 text-premium-muted group-hover:text-electric-indigo" /> : <Sun className="h-4 w-4 text-premium-muted group-hover:text-cyan-violet" />}
                <span className="font-medium">Theme</span>
              </div>
              <span className="text-[9px] font-semibold bg-electric-indigo/10 px-2 py-1 rounded text-premium-muted border border-electric-indigo/10">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </button>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-premium-text hover:bg-electric-indigo/10 hover:text-cyan-violet rounded-xl transition-all group"
            >
              <Settings className="h-4 w-4 text-premium-muted group-hover:text-electric-indigo" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          <div className="p-3 border-t border-electric-indigo/10">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cyan-violet hover:bg-cyan-violet/10 hover:text-indigo-cyan rounded-xl transition-all font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
