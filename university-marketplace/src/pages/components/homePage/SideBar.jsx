import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag , Logs, Settings, CircleHelp } from 'lucide-react';
import logo from '../../../assets/logo1.png';

function SideBar() {
  return (
     <div className="flex-col items-center gap-3">
        <div className="flex items-center mb-5">
        <img
          src={logo}
          alt="Logo"
          className="w-15 h-15 rounded-full object-cover"
       />
       <span className="text-lg font-semibold text-[#010909] ml-1 ">UniBazaar</span>
     </div>
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
      </nav> 
      </div>
  );
};

export default SideBar;

    