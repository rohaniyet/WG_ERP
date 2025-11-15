
import React, { useState, useEffect } from 'react';
import type { PurchaseOrder, RawMaterial, Supplier, FinishedProduct, Distributor, OrderStatus } from '../types';
import { Table } from './ui/Table';
import { Modal } from './ui/Modal';
import { PrintableInvoice } from './PrintableInvoice';
import { PrintIcon } from './Icons';

interface PurchasesProps {
    purchaseOrders: PurchaseOrder[];
    addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void;
    rawMaterials: RawMaterial[];
    suppliers: Supplier[];
    finishedProducts: FinishedProduct[];
    distributors: Distributor[];
    addSupplier: (name: string) => Supplier;
    addRawMaterial: (material: Omit<RawMaterial, 'id' | 'stock'>) => RawMaterial;
    handleUpdatePurchaseStatus: (orderId: string, status: OrderStatus) => void;
}

const emptyOrder = {
  materialId: '',
  quantity: '',
  rate: '',
  supplierId: ''
};

export const Purchases: React.FC<PurchasesProps> = ({ purchaseOrders, addPurchaseOrder, rawMaterials, suppliers, finishedProducts, distributors, addSupplier, addRawMaterial, handleUpdatePurchaseStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [newOrder, setNewOrder] = useState(emptyOrder);

  const [isAddSupplierOpen, setAddSupplierOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');

  const [isAddMaterialOpen, setAddMaterialOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', unit: 'kg' as RawMaterial['unit'], costPerUnit: '' });
  
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);


  useEffect(() => {
    if (rawMaterials.length > 0 && !newOrder.materialId) {
      setNewOrder(prev => ({ ...prev, materialId: rawMaterials[0].id }));
    }
    if (suppliers.length > 0 && !newOrder.supplierId) {
      setNewOrder(prev => ({ ...prev, supplierId: suppliers[0].id }));
    }
  }, [rawMaterials, suppliers]);

  useEffect(() => {
    const material = rawMaterials.find(m => m.id === newOrder.materialId);
    if(material) {
        setNewOrder(prev => ({...prev, rate: material.costPerUnit.toString()}));
    }
  }, [newOrder.materialId, rawMaterials]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePrintClick = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsInvoiceModalOpen(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { materialId, quantity, rate, supplierId } = newOrder;
    if (!materialId || !quantity || !rate || !supplierId) return;

    const newPurchase: Omit<PurchaseOrder, 'id'> = {
      materialId,
      quantity: Number(quantity),
      rate: Number(rate),
      totalCost: Number(quantity) * Number(rate),
      supplierId,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    addPurchaseOrder(newPurchase);
    setIsModalOpen(false);
    setNewOrder(emptyOrder);
  };

  const handleAddSupplierSubmit = () => {
    const trimmedName = newSupplierName.trim();
    if (!trimmedName) {
      alert("Supplier name cannot be empty.");
      return;
    }
    const newSupplier = addSupplier(trimmedName);
    if (newSupplier && newSupplier.id) {
        setNewOrder(prev => ({ ...prev, supplierId: newSupplier.id }));
        setNewSupplierName('');
        setAddSupplierOpen(false);
    } else {
        alert("Error: Could not add new supplier.");
    }
  };

  const handleAddMaterialSubmit = () => {
    const { name, unit, costPerUnit } = newMaterial;
    if (!name.trim() || !unit || !costPerUnit || Number(costPerUnit) <= 0) {
        alert("Please fill all fields with valid values for the new material.");
        return;
    }
    const newAddedMaterial = addRawMaterial({
        name,
        unit,
        costPerUnit: Number(costPerUnit),
    });
    if (newAddedMaterial && newAddedMaterial.id) {
        setNewOrder(prev => ({ ...prev, materialId: newAddedMaterial.id }));
        setNewMaterial({ name: '', unit: 'kg', costPerUnit: '' });
        setAddMaterialOpen(false);
    } else {
        alert("Error: Could not add new raw material.");
    }
  };
  
  const getMaterialName = (id: string) => rawMaterials.find(m => m.id === id)?.name || 'N/A';
  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || 'N/A';
  
  const statusBadge = (status: string) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case 'Completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
      case 'Cancelled': return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'id' as keyof PurchaseOrder },
    { header: 'Material', accessor: (item: PurchaseOrder) => getMaterialName(item.materialId) },
    { header: 'Supplier', accessor: (item: PurchaseOrder) => getSupplierName(item.supplierId) },
    { header: 'Total Cost', accessor: (item: PurchaseOrder) => `PKR ${item.totalCost.toLocaleString()}` },
    { header: 'Order Date', accessor: 'orderDate' as keyof PurchaseOrder },
    { header: 'Status', accessor: (item: PurchaseOrder) => statusBadge(item.status) },
    { header: 'Actions', accessor: (item: PurchaseOrder) => (
      <div className="relative">
          <button onClick={() => setOpenActionMenu(openActionMenu === item.id ? null : item.id)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
          </button>
          {openActionMenu === item.id && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20" onMouseLeave={() => setOpenActionMenu(null)}>
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button onClick={() => { handlePrintClick(item); setOpenActionMenu(null); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          <PrintIcon className="mr-3 h-5 w-5 text-gray-400"/>
                          <span>Print Invoice</span>
                      </button>
                      {item.status === 'Pending' && (
                          <button onClick={() => { handleUpdatePurchaseStatus(item.id, 'Completed'); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Mark as Completed
                          </button>
                      )}
                      {item.status === 'Completed' && (
                          <button onClick={() => { handleUpdatePurchaseStatus(item.id, 'Pending'); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                              Mark as Pending
                          </button>
                      )}
                  </div>
              </div>
          )}
      </div>
  )},
  ];

  const totalAmount = (Number(newOrder.quantity) * Number(newOrder.rate)).toLocaleString();
  const selectedMaterialUnit = rawMaterials.find(m => m.id === newOrder.materialId)?.unit;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Purchase Orders</h3>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Add Purchase</button>
      </div>
      <Table columns={columns} data={purchaseOrders} />
      
      {/* Add Purchase Modal */}
      <Modal title="Add New Purchase Order" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="orderDate" id="orderDate" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">Supplier</label>
              <select id="supplierId" name="supplierId" value={newOrder.supplierId} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setAddSupplierOpen(true)} className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">+</button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label htmlFor="materialId" className="block text-sm font-medium text-gray-700">Raw Material</label>
              <select id="materialId" name="materialId" value={newOrder.materialId} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
                {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setAddMaterialOpen(true)} className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">+</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity ({selectedMaterialUnit})</label>
                <input type="number" name="quantity" id="quantity" value={newOrder.quantity} onChange={handleInputChange} min="1" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                <input type="number" name="rate" id="rate" value={newOrder.rate} onChange={handleInputChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="mt-1 p-2 block w-full sm:text-sm border border-gray-200 bg-gray-100 rounded-md">PKR {totalAmount}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Order</button>
          </div>
        </form>
      </Modal>

      {/* Add Supplier Modal */}
      <Modal title="Add New Supplier" isOpen={isAddSupplierOpen} onClose={() => setAddSupplierOpen(false)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input type="text" id="supplierName" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
          </div>
          <div className="flex justify-end pt-2">
             <button type="button" onClick={() => setAddSupplierOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddSupplierSubmit} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Supplier</button>
          </div>
        </div>
      </Modal>

      {/* Add Raw Material Modal */}
      <Modal title="Add New Raw Material" isOpen={isAddMaterialOpen} onClose={() => setAddMaterialOpen(false)}>
          <div className="space-y-4">
              <div>
                  <label htmlFor="materialName" className="block text-sm font-medium text-gray-700">Material Name</label>
                  <input type="text" id="materialName" value={newMaterial.name} onChange={e => setNewMaterial(p => ({...p, name: e.target.value}))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="materialUnit" className="block text-sm font-medium text-gray-700">Unit</label>
                    <select id="materialUnit" value={newMaterial.unit} onChange={e => setNewMaterial(p => ({...p, unit: e.target.value as RawMaterial['unit']}))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md bg-white text-gray-900">
                        <option>kg</option>
                        <option>liters</option>
                        <option>units</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="materialCost" className="block text-sm font-medium text-gray-700">Cost per Unit</label>
                    <input type="number" id="materialCost" value={newMaterial.costPerUnit} onChange={e => setNewMaterial(p => ({...p, costPerUnit: e.target.value}))} min="0" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setAddMaterialOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddMaterialSubmit} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Material</button>
              </div>
          </div>
      </Modal>

      {/* Invoice Modal */}
      {selectedOrder && (
         <Modal title={`Purchase Invoice: ${selectedOrder.id}`} isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)}>
            <PrintableInvoice order={selectedOrder} type="purchase" data={{rawMaterials, finishedProducts, suppliers, distributors}} />
         </Modal>
      )}
    </div>
  );
};
