import React from 'react';
import { useAuth } from '../../services/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-xl font-bold">UniBazaar</div>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-700">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
