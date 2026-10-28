import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import PillNav, { PillNavItem } from './PillNav';
import toast from 'react-hot-toast';

// Custom router link that handles clean client-side routing with no hash URLs
const RouterLink: React.FC<{
  href?: string;
  to?: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}> = ({ href, to, children, ...props }) => {
  const target = href || to || '/';
  return (
    <Link to={target} {...props}>
      {children}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
  };

  const navItems: PillNavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Missions', href: '/problems' },
    { label: 'Leaderboard', href: '/leaderboard' },
    ...(user
      ? [
          { label: 'Profile', href: '/profile' },
          {
            label: 'Sign Out',
            onClick: handleSignOut
          }
        ]
      : [
          { label: 'Sign In', href: '/login' }
        ]
    ),
    {
      label: isDark ? 'Light' : 'Dark',
      ariaLabel: `Switch to ${isDark ? 'light' : 'dark'} mode`,
      onClick: toggleTheme,
      icon: (
        <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
          {isDark ? (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
              <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .91.972A8 8 0 1 1 6 .278z" />
            </svg>
          )}
        </span>
      )
    }
  ];

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex items-center justify-center px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl flex items-center justify-center">
        <PillNav
          logo="/bug-icon.svg"
          logoAlt="BugRank"
          logoHref="/"
          items={navItems}
          activeHref={location.pathname}
          theme={isDark ? 'dark' : 'light'}
          layout="split"
          itemStyle="pill"
          hoverEffect="fill"
          indicator="dot"
          surface="glass"
          size="md"
          linkComponent={RouterLink}
          ariaLabel="Primary Navigation"
        />
      </div>
    </header>
  );
};

export default Navbar;
