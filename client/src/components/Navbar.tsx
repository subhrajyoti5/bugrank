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
    { path: '/problems', icon: Code2, label: 'Terminal' },
    { path: '/leaderboard', icon: Trophy, label: 'Ranking' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'py-3 bg-black/80 backdrop-blur-xl border-white/[0.05] shadow-2xl' 
        : 'py-4 bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/problems" className="flex items-center gap-3 group">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tighter">
            Bug<span className="text-white/40">Rank</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl backdrop-blur-md">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-6 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200 flex items-center gap-2 group ${
                isActive(path)
                ? 'text-white bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                : 'text-white/40 hover:text-white'
                }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive(path) ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex p-2 text-white/40 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full border border-black" />
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {user ? (
            <ProfileDropdown onLogout={signOut} />
          ) : (
            <Link
              to="/login"
              className="btn-primary-premium py-1.5 px-6 text-[10px] font-bold uppercase tracking-widest"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/[0.05] py-8 px-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all ${
                isActive(path)
                  ? 'bg-white/5 text-white border border-white/10'
                  : 'text-white/40 hover:text-white bg-white/[0.02]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive(path) ? 'text-white' : ''}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;


