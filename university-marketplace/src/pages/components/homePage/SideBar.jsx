import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ShoppingBag , Logs, Settings, CircleHelp, CirclePlus, LogOut } from 'lucide-react';
import { useAuth } from '../../../services/authContext';
import logo from '../../../assets/logo1.png';

function SideBar() {
    const { user, logout } = useAuth();
  
  return (
     <div className="flex-col items-center gap-3">
     <Link
  to="/home"
  className="flex items-center gap-2 sm:gap-3 px-2 py-1 hover:opacity-90 transition mb-4"
>
  <img
    src={logo}
    alt="Logo"
    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
  />
  <span className="text-base sm:text-lg font-semibold text-[#010909]">
    UniBazaar
  </span>
</Link>
       {/* Navigation */}
      <nav className="flex flex-col space-y-4 text-sm font-medium text-gray-700">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center  gap-2 px-3 py-2 rounded-xl hover:bg-gray-400 ${
              isActive ? 'bg-[#f0f2f5] text-black font-semibold' : ''
            }`
          }
        >
        <Home size={25} className="text-black" /><span className="text-black text-lg">Home</span>
    </NavLink>

        <NavLink
          to="/purchases"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400  ${
              isActive ? 'bg-gray-100 text-black font-semibold' : ''
            }`
          }
        >
          <ShoppingBag size={25} className="text-black " /><span className="text-black text-[1.2em]">Purchases</span>
        </NavLink>

        <NavLink
          to="/my-items"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400 ${
              isActive ? 'bg-gray-100 text-black font-semibold' : ''
            }`
          }
        >
          <Logs size={25} className="text-black" /><span className="text-black text-[1.2em]">My Items</span>
        </NavLink>
         <NavLink
          to="/add-item"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400  ${
              isActive ? 'bg-gray-100 text-black font-semibold' : ''
            }`
          }
        >
          <CirclePlus size={25} className="text-black " /><span className="text-black text-[1.2em]">Add Items</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400 ${
              isActive ? 'bg-gray-100 text-black font-semibold' : ''
            }`
          }
        >
          <Settings size={25} className="text-black" /><span className="text-black text-[1.2em]">Settings</span>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400 ${
              isActive ? 'bg-gray-100 text-black font-semibold' : ''
            }`
          }
        >
          <CircleHelp size={25} className="text-black" /><span className="text-black text-[1.2em]">Help</span>
        </NavLink>

         <NavLink
          onClick={() => {
    logout(); }}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-400 ${
              isActive ? ' text-black font-semibold' : ''
            }`
          }
        >
          <LogOut size={25} className="text-black" /><span className="text-black text-[1.2em]">Logout</span>
        </NavLink>
      </nav> 
      </div>
  );
};

export default SideBar;

    