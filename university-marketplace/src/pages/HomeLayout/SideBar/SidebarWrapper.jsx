import { useState } from 'react';
import { AlignJustify } from 'lucide-react';
import Sidebar from './SideBar';

export default function SidebarWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="relative">
      {/* Topbar for mobile */}
      <div className="p-3 shadow flex sm:hidden items-center justify-between">
        <AlignJustify
          size={24}
          onClick={() => setIsSidebarOpen(true)}
          className="cursor-pointer text-black"
        />
        <span className="text-xl font-semibold">UniBazaar</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:relative sm:translate-x-0 sm:block
        `}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
