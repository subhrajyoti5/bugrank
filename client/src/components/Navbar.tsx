import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, Trophy, Code2, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/problems" className="flex items-center space-x-2 group">
              <Bug className="h-7 w-7 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold text-white tracking-tight">Bugrank</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-0.5">
            <Link
              to="/problems"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isActive('/problems')
                  ? 'bg-slate-800 text-orange-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Problems</span>
            </Link>

            <Link
              to="/leaderboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isActive('/leaderboard')
                  ? 'bg-slate-800 text-orange-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Leaderboard</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                isActive('/profile')
                  ? 'bg-slate-800 text-orange-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-semibold text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-medium text-slate-200">{user.displayName}</p>
                    <p className="text-xs text-orange-400 font-medium">{user.totalScore} pts</p>
                  </div>
                </div>

                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="p-1.5 rounded text-slate-400 hover:text-orange-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
