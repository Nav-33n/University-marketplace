import React from 'react';
import Navbar from './Logout';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
