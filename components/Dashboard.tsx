import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import type { BusinessData } from '../types';
import { SalesIcon, PurchaseIcon, InventoryIcon, BankIcon, DollarSignIcon } from './Icons';

interface DashboardProps {
  data: BusinessData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const kpis = useMemo(() => {
    const totalSales = data.sales.reduce((acc, sale) => acc + sale.totalRevenue, 0);
    const totalPurchases = data.purchaseOrders.reduce((acc, p) => acc + p.totalCost, 0);
    const rawMaterialValue = data.rawMaterials.reduce((acc, m) => acc + m.stock * m.costPerUnit, 0);
    const finishedGoodsValue = data.finishedProducts.reduce((acc, p) => acc + p.stock * p.price, 0);
    const bankBalance = data.bankAccounts.reduce((acc, b) => acc + b.balance, 0);
    const payables = data.purchaseOrders.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.totalCost, 0);
    const receivables = data.sales.filter(s => s.status === 'Unpaid').reduce((acc, s) => acc + s.totalRevenue, 0);
    
    return {
      totalSales,
      totalPurchases,
      rawMaterialValue,
      finishedGoodsValue,
      bankBalance,
      payables,
      receivables
    };
  }, [data]);


  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Sales" value={`PKR ${kpis.totalSales.toLocaleString()}`} icon={<SalesIcon className="h-6 w-6 text-white"/>} colorClass="bg-green-500" />
        <Card title="Total Purchases" value={`PKR ${kpis.totalPurchases.toLocaleString()}`} icon={<PurchaseIcon className="h-6 w-6 text-white"/>} colorClass="bg-blue-500" />
        <Card title="Receivables" value={`PKR ${kpis.receivables.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-yellow-500" />
        <Card title="Payables" value={`PKR ${kpis.payables.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-orange-500" />
      </div>
       <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Raw Material Value" value={`PKR ${kpis.rawMaterialValue.toLocaleString()}`} icon={<InventoryIcon className="h-6 w-6 text-white"/>} colorClass="bg-indigo-500" />
        <Card title="Finished Goods Value" value={`PKR ${kpis.finishedGoodsValue.toLocaleString()}`} icon={<InventoryIcon className="h-6 w-6 text-white"/>} colorClass="bg-purple-500" />
        <Card title="Bank Balance" value={`PKR ${kpis.bankBalance.toLocaleString()}`} icon={<BankIcon className="h-6 w-6 text-white"/>} colorClass="bg-pink-500" />
      </div>
    </div>
  );
};