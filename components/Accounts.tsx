
import React, { useMemo, useState } from 'react';
import type { BusinessData, LedgerEntry, ChartOfAccount } from '../types';
import { Table } from './ui/Table';
import { Card } from './ui/Card';
import { DollarSignIcon } from './Icons';
import { MOCK_CHART_OF_ACCOUNTS } from '../constants';

interface AccountsProps {
  data: BusinessData;
}

type Tab = 'Overview' | 'ChartOfAccounts' | 'Ledger';

export const Accounts: React.FC<AccountsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState('All');

  const { sales, purchaseOrders, rawMaterials, finishedProducts, employees, expenses, suppliers, distributors } = data;

  const overviewData = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalRevenue, 0);

    const cogs = sales.reduce((sum, sale) => {
        const product = finishedProducts.find(p => p.id === sale.productId);
        if (!product) return sum;

        const productCost = product.recipe.reduce((cost, ingredient) => {
            const material = rawMaterials.find(m => m.id === ingredient.materialId);
            if (!material) return cost;
            return cost + (ingredient.quantity * material.costPerUnit);
        }, 0);

        return sum + (sale.quantity * productCost);
    }, 0);

    const grossProfit = totalRevenue - cogs;

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) +
                         employees.reduce((sum, emp) => sum + emp.salary, 0); // Assuming monthly salary as an expense
    
    const netProfit = grossProfit - totalExpenses;

    return {
        totalRevenue,
        cogs,
        grossProfit,
        totalExpenses,
        netProfit,
    };
  }, [sales, finishedProducts, rawMaterials, expenses, employees]);

  const ledgerEntries: LedgerEntry[] = useMemo(() => {
    const entries: LedgerEntry[] = [];
    
    purchaseOrders.forEach(p => entries.push({
      id: `L-P-${p.id}`,
      date: p.orderDate,
      account: suppliers.find(s => s.id === p.supplierId)?.name || 'Unknown Supplier',
      description: `Purchase of ${data.rawMaterials.find(m => m.id === p.materialId)?.name}`,
      debit: p.totalCost,
      credit: 0,
      type: 'Purchase',
    }));

    sales.forEach(s => entries.push({
      id: `L-S-${s.id}`,
      date: s.saleDate,
      account: distributors.find(d => d.id === s.distributorId)?.name || 'Unknown Distributor',
      description: `Sale of ${data.finishedProducts.find(p => p.id === s.productId)?.name}`,
      debit: 0,
      credit: s.totalRevenue,
      type: 'Sale',
    }));

    expenses.forEach(e => entries.push({
      id: `L-E-${e.id}`,
      date: e.date,
      account: e.category,
      description: e.description,
      debit: e.amount,
      credit: 0,
      type: 'Expense',
    }));

    // This is a simplification; real accounting would have more complex salary entries
    employees.forEach(emp => entries.push({
        id: `L-EMP-${emp.id}`,
        date: new Date().toISOString().split('T')[0], // Assuming salary paid today for demo
        account: emp.name,
        description: `Monthly Salary for ${emp.role}`,
        debit: emp.salary,
        credit: 0,
        type: 'Salary'
    }));

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, purchaseOrders, employees, expenses, suppliers, distributors, data.rawMaterials, data.finishedProducts]);

  const ledgerAccounts = ['All', ...suppliers.map(s => s.name), ...distributors.map(d => d.name), ...employees.map(e => e.name), 'Utilities', 'Rent', 'Marketing', 'Supplies', 'Other'];

  const filteredLedger = ledgerEntries.filter(entry => selectedLedgerAccount === 'All' || entry.account === selectedLedgerAccount);

  const coaColumns = [
    { header: 'Account Name', accessor: 'accountName' as keyof ChartOfAccount },
    { header: 'Account Type', accessor: 'type' as keyof ChartOfAccount },
  ];
  
  const ledgerColumns = [
      { header: 'Date', accessor: 'date' as keyof LedgerEntry },
      { header: 'Account', accessor: 'account' as keyof LedgerEntry },
      { header: 'Description', accessor: 'description' as keyof LedgerEntry },
      { header: 'Debit (PKR)', accessor: (item: LedgerEntry) => item.debit ? item.debit.toLocaleString() : '-' },
      { header: 'Credit (PKR)', accessor: (item: LedgerEntry) => item.credit ? item.credit.toLocaleString() : '-' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="mt-6">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card title="Total Revenue" value={`PKR ${overviewData.totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-green-500" />
                  <Card title="Cost of Goods Sold" value={`PKR ${overviewData.cogs.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-orange-500" />
                  <Card title="Gross Profit" value={`PKR ${overviewData.grossProfit.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-blue-500" />
                  <Card title="Operating Expenses" value={`PKR ${overviewData.totalExpenses.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass="bg-red-500" />
                  <Card title="Net Profit" value={`PKR ${overviewData.netProfit.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} colorClass={overviewData.netProfit >= 0 ? 'bg-teal-500' : 'bg-pink-500'} />
              </div>
          </div>
        );
      case 'ChartOfAccounts':
        return (
          <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Chart of Accounts</h4>
            <p className="text-gray-600 mb-4">A list of all financial accounts in the general ledger of a company.</p>
            <Table columns={coaColumns} data={MOCK_CHART_OF_ACCOUNTS} />
          </div>
        );
      case 'Ledger':
        return (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-xl font-semibold text-gray-700">General Ledger</h4>
                    <p className="text-gray-600">A record of all financial transactions.</p>
                </div>
                <div>
                    <label htmlFor="ledgerAccount" className="block text-sm font-medium text-gray-700">Filter by Account</label>
                    <select id="ledgerAccount" value={selectedLedgerAccount} onChange={e => setSelectedLedgerAccount(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900">
                        {ledgerAccounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </select>
                </div>
            </div>
            <Table columns={ledgerColumns} data={filteredLedger} />
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: {tab: Tab, label: string}) => (
      <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
          {label}
      </button>
  );

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700">Accounting</h3>
      <div className="mt-4 border-b border-gray-200">
        <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton tab="Overview" label="Overview" />
            <TabButton tab="Ledger" label="General Ledger" />
            <TabButton tab="ChartOfAccounts" label="Chart of Accounts" />
        </nav>
      </div>
      {renderContent()}
    </div>
  );
};
