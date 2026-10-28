import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col transition-colors duration-300">
      <Navbar />
        <main className="pt-24 flex-1">
          <Outlet />
        </main>
    </div>
  );
};

export default Layout;
