
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`rounded-full p-3 ${colorClass}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
