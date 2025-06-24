import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Logs, Settings, CircleHelp } from 'lucide-react';
import logo from '../../../assets/logo1.png';

function SideBar() {
  return (
     <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 rounded-full object-cover"
       />
       <span className="text-lg font-semibold">Unibazaar</span>
     </div>
  );
};

export default SideBar;

    