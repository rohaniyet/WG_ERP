
import React, { useState, useEffect } from 'react';
import type { Sale, FinishedProduct, Distributor, RawMaterial, Supplier } from '../types';
import { Table } from './ui/Table';
import { Modal } from './ui/Modal';
import { PrintableInvoice } from './PrintableInvoice';
import { PrintIcon } from './Icons';

interface SalesProps {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  finishedProducts: FinishedProduct[];
  distributors: Distributor[];
  rawMaterials: RawMaterial[];
  suppliers: Supplier[];
  addDistributor: (name: string) => Distributor;
}

const emptySale = {
    productId: '',
    quantity: '',
    rate: '',
    distributorId: '',
    paymentMethod: 'Cash' as 'Cash' | 'Credit'
};

export const Sales: React.FC<SalesProps> = ({ sales, addSale, finishedProducts, distributors, rawMaterials, suppliers, addDistributor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [newSale, setNewSale] = useState(emptySale);
  
  const [isAddDistributorOpen, setAddDistributorOpen] = useState(false);
  const [newDistributorName, setNewDistributorName] = useState('');

  useEffect(() => {
    if (finishedProducts.length > 0 && !newSale.productId) {
      setNewSale(prev => ({ ...prev, productId: finishedProducts[0].id }));
    }
    if (distributors.length > 0 && !newSale.distributorId) {
      setNewSale(prev => ({ ...prev, distributorId: distributors[0].id }));
    }
  }, [finishedProducts, distributors]);

  useEffect(() => {
    const product = finishedProducts.find(p => p.id === newSale.productId);
    if(product) {
        setNewSale(prev => ({...prev, rate: product.price.toString()}));
    }
  }, [newSale.productId, finishedProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSale(prev => ({ ...prev, [name]: value }));
  };

  const handlePrintClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsInvoiceModalOpen(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { productId, quantity, rate, distributorId, paymentMethod } = newSale;
    const product = finishedProducts.find(p => p.id === productId);
    if (!productId || !quantity || !rate || !distributorId || !product) return;

    if (product.stock < Number(quantity)) {
        alert(`Error: Not enough stock for ${product.name}. Available: ${product.stock}`);
        return;
    }

    const saleToAdd: Omit<Sale, 'id'> = {
        productId,
        quantity: Number(quantity),
        rate: Number(rate),
        totalRevenue: Number(quantity) * Number(rate),
        distributorId,
        paymentMethod,
        saleDate: new Date().toISOString().split('T')[0],
        status: paymentMethod === 'Cash' ? 'Paid' : 'Unpaid'
    };
    addSale(saleToAdd);
    setIsModalOpen(false);
    setNewSale(emptySale);
  };
  
  const handleAddDistributorSubmit = () => {
    const trimmedName = newDistributorName.trim();
    if (!trimmedName) {
        alert("Distributor name cannot be empty.");
        return;
    }
    const newDistributor = addDistributor(trimmedName);
    if(newDistributor && newDistributor.id) {
        setNewSale(prev => ({ ...prev, distributorId: newDistributor.id }));
        setNewDistributorName('');
        setAddDistributorOpen(false);
    } else {
        alert("Error: Could not add new distributor.");
    }
  };

  const getProductName = (id: string) => finishedProducts.find(p => p.id === id)?.name || 'N/A';
  const getDistributorName = (id: string) => distributors.find(d => d.id === id)?.name || 'N/A';

  const statusBadge = (status: string) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case 'Paid': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'Unpaid': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const columns = [
    { header: 'Sale ID', accessor: 'id' as keyof Sale },
    { header: 'Product', accessor: (item: Sale) => getProductName(item.productId) },
    { header: 'Distributor', accessor: (item: Sale) => getDistributorName(item.distributorId) },
    { header: 'Total Revenue', accessor: (item: Sale) => `PKR ${item.totalRevenue.toLocaleString()}` },
    { header: 'Sale Date', accessor: 'saleDate' as keyof Sale },
    { header: 'Status', accessor: (item: Sale) => statusBadge(item.status) },
    { header: 'Actions', accessor: (item: Sale) => (
        <button onClick={() => handlePrintClick(item)} className="text-indigo-600 hover:text-indigo-900"><PrintIcon /></button>
    )},
  ];

  const totalAmount = (Number(newSale.quantity) * Number(newSale.rate)).toLocaleString();
  const selectedProductUnit = finishedProducts.find(p => p.id === newSale.productId)?.unit;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Sales Orders</h3>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Add Sale</button>
      </div>
      <Table columns={columns} data={sales} />

       {/* Add Sale Modal */}
      <Modal title="Add New Sale Order" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label htmlFor="distributorId" className="block text-sm font-medium text-gray-700">Distributor</label>
              <select id="distributorId" name="distributorId" value={newSale.distributorId} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
                {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setAddDistributorOpen(true)} className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">+</button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Finished Product</label>
              <select id="productId" name="productId" value={newSale.productId} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
                {finishedProducts.map(p => <option key={p.id} value={p.id}>{p.name} (In Stock: {p.stock})</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity ({selectedProductUnit})</label>
                <input type="number" name="quantity" id="quantity" value={newSale.quantity} onChange={handleInputChange} min="1" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                <input type="number" name="rate" id="rate" value={newSale.rate} onChange={handleInputChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="mt-1 p-2 block w-full sm:text-sm border border-gray-200 bg-gray-100 rounded-md">PKR {totalAmount}</p>
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select id="paymentMethod" name="paymentMethod" value={newSale.paymentMethod} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Cash</option>
              <option>Credit</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Sale</button>
          </div>
        </form>
      </Modal>

      {/* Add Distributor Modal */}
      <Modal title="Add New Distributor" isOpen={isAddDistributorOpen} onClose={() => setAddDistributorOpen(false)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="distributorName" className="block text-sm font-medium text-gray-700">Distributor Name</label>
            <input type="text" id="distributorName" value={newDistributorName} onChange={e => setNewDistributorName(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={() => setAddDistributorOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddDistributorSubmit} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Distributor</button>
          </div>
        </div>
      </Modal>

      {/* Invoice Modal */}
       {selectedSale && (
         <Modal title={`Sale Invoice: ${selectedSale.id}`} isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)}>
            <PrintableInvoice order={selectedSale} type="sale" data={{rawMaterials, finishedProducts, suppliers, distributors}} />
         </Modal>
      )}
    </div>
  );
};
