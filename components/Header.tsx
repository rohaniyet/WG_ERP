
import React from 'react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="relative mx-4 lg:mx-0">
          <h1 className="text-xl font-semibold text-gray-700 hidden md:block">ManuPro ERP</h1>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative">
          <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
            <img className="h-8 w-8 rounded-full object-cover" src="https://picsum.photos/100" alt="Your avatar" />
          </button>
        </div>
      </div>
    </header>
  );
};
