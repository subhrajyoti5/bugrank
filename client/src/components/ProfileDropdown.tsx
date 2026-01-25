import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut, Moon, Sun } from 'lucide-react';

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
    setIsDark(!isDark);
    // In a real app, this would toggle a class on the html element
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-200 border border-white/10 hover:border-white/20 group"
      >
        <div className="relative">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-white">{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-[#0a0a0a] rounded-full shadow-lg"></div>
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-white group-hover:text-white transition-colors">{user.displayName}</p>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 group-hover:text-white ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 backdrop-blur-sm bg-black/40">
          {/* Header Stats */}
          <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-violet-900/20 to-orange-900/20">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Quick Stats</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <span className="block text-xl font-black text-white">{user.totalScore || 0}</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Points</span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-xl font-black text-emerald-400">{user.successfulSubmissions || 0}</span>
                <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Solved</span>
              </div>
              <div className="col-span-3 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-orange-500"
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
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-all group"
            >
              <User className="h-4 w-4 text-slate-500 group-hover:text-violet-400" />
              <span className="font-medium">View Profile</span>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="h-4 w-4 text-slate-500 group-hover:text-purple-400" /> : <Sun className="h-4 w-4 text-slate-500 group-hover:text-amber-400" />}
                <span className="font-medium">Theme</span>
              </div>
              <span className="text-[9px] font-semibold bg-white/10 px-2 py-1 rounded text-slate-400 border border-white/10">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </button>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-all group"
            >
              <Settings className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all font-medium"
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
