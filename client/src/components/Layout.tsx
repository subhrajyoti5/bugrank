import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;

