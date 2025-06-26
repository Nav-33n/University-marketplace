import React from 'react';
import { Search } from 'lucide-react';


export default function SearchBar() {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm w-xs max-w-md">
      <input
        type="text"
        placeholder="Search items..."
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
      />
      <Search size={15} className="text-gray-500" />
    </div>
  );
}