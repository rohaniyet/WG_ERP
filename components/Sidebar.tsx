import React from 'react';
import type { View } from '../types';
import { DashboardIcon, PurchaseIcon, ProductionIcon, InventoryIcon, SalesIcon, AccountsIcon, InsightsIcon, CloseIcon } from './Icons';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// FIX: Use React.ReactNode instead of JSX.Element to avoid namespace error.
const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: 'DASHBOARD', label: 'Dashboard', icon: <DashboardIcon /> },
  { view: 'PURCHASES', label: 'Purchases', icon: <PurchaseIcon /> },
  { view: 'PRODUCTION', label: 'Production', icon: <ProductionIcon /> },
  { view: 'INVENTORY', label: 'Inventory', icon: <InventoryIcon /> },
  { view: 'SALES', label: 'Sales', icon: <SalesIcon /> },
  { view: 'ACCOUNTS', label: 'Accounts', icon: <AccountsIcon /> },
  { view: 'INSIGHTS', label: 'AI Insights', icon: <InsightsIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, isSidebarOpen, setSidebarOpen }) => {
  const handleNavClick = (newView: View) => {
    setView(newView);
    setSidebarOpen(false);
  };
  
  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white text-2xl font-bold">ManuPro</span>
           <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
              <CloseIcon />
            </button>
        </div>
        <nav className="mt-5">
          {navItems.map((item) => (
            <a
              key={item.view}
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer ${view === item.view ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => handleNavClick(item.view)}
            >
              {item.icon}
              <span className="mx-3">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};
