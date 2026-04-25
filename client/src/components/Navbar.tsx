import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, Trophy, Code2, Menu, X, Bell } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/problems', icon: Code2, label: 'Problems' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
      scrolled 
        ? 'py-3 bg-[#0b1120]/80 backdrop-blur-xl border-white/5 shadow-2xl' 
        : 'py-5 bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/problems" className="flex items-center gap-3 group">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
            <Hash className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            Bug<span className="text-indigo-400">Rank</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl backdrop-blur-md">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-5 py-2 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group ${
                isActive(path)
                ? 'text-white bg-white/5'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive(path) ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
              <span>{label}</span>
              {isActive(path) && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0b1120]" />
          </button>

          <div className="h-6 w-px bg-white/5 hidden sm:block" />

          {user ? (
            <ProfileDropdown onLogout={signOut} />
          ) : (
            <Link
              to="/login"
              className="btn-primary-premium py-2 px-6 text-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0b1120] border-b border-white/5 py-6 px-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all ${
                isActive(path)
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive(path) ? 'text-indigo-400' : ''}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

