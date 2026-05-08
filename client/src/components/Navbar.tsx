import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, Trophy, Code2, Menu, X, Bell, Terminal } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/problems', icon: Terminal, label: 'Terminal' },
    { path: '/leaderboard', icon: Trophy, label: 'Ranking' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-xl border-white/[0.08]' 
        : 'bg-transparent border-white/[0.05]'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tighter">
            Bug<span className="text-white/40">Rank</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200 flex items-center gap-2 group ${
                isActive(path)
                ? 'text-white'
                : 'text-white/40 hover:text-white'
                }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive(path) ? 'text-white' : 'text-white/20 group-hover:text-white'}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <button className="p-2 text-white/20 hover:text-white transition-colors relative">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full" />
               </button>
               <ProfileDropdown onLogout={signOut} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="btn-primary-premium py-2 px-6 text-[10px] font-bold uppercase tracking-widest"
                >
                    Launch App
                </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] py-8 px-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all ${
                isActive(path)
                  ? 'bg-white/5 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;



