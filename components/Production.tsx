
import React, { useState } from 'react';
import type { ProductionOrder, FinishedProduct, RawMaterial, OrderStatus } from '../types';
import { Table } from './ui/Table';
import { Modal } from './ui/Modal';

interface ProductionProps {
  productionOrders: ProductionOrder[];
  addProductionOrder: (order: Omit<ProductionOrder, 'id' | 'batchNumber'>) => void;
  finishedProducts: FinishedProduct[];
  rawMaterials: RawMaterial[];
  addFinishedProduct: (product: Omit<FinishedProduct, 'id' | 'stock'>) => FinishedProduct;
  handleUpdateProductionStatus: (orderId: string, status: OrderStatus) => void;
}

const emptyBatch = {
    inputs: [{ materialId: '', quantity: '' }],
    output: { productId: '', quantity: '' }
};

export const Production: React.FC<ProductionProps> = ({ productionOrders, addProductionOrder, finishedProducts, rawMaterials, addFinishedProduct, handleUpdateProductionStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newBatch, setNewBatch] = useState(emptyBatch);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const getProductName = (id: string) => finishedProducts.find(p => p.id === id)?.name || 'N/A';
  
  const statusBadge = (status: string) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case 'Completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'In Progress': return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
      case 'Cancelled': return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const handleInputChange = (type: 'input' | 'output', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (type === 'input') {
        const updatedInputs = [...newBatch.inputs];
        updatedInputs[index] = { ...updatedInputs[index], [name]: value };
        setNewBatch(prev => ({ ...prev, inputs: updatedInputs }));
    } else {
        setNewBatch(prev => ({ ...prev, output: { ...prev.output, [name]: value } }));
    }
  };

  const addInputMaterial = () => {
    setNewBatch(prev => ({ ...prev, inputs: [...prev.inputs, { materialId: '', quantity: '' }] }));
  };

  const removeInputMaterial = (index: number) => {
    setNewBatch(prev => ({ ...prev, inputs: prev.inputs.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.output.productId || !newBatch.output.quantity || newBatch.inputs.some(i => !i.materialId || !i.quantity)) {
        alert("Please fill all fields for inputs and output.");
        return;
    }

    const newProductionOrder: Omit<ProductionOrder, 'id' | 'batchNumber'> = {
        inputs: newBatch.inputs.map(i => ({...i, quantity: Number(i.quantity)})),
        output: { ...newBatch.output, quantity: Number(newBatch.output.quantity) },
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        status: 'In Progress'
    };
    addProductionOrder(newProductionOrder);
    setIsModalOpen(false);
    setNewBatch(emptyBatch);
  };

  const handleAddProductSubmit = () => {
    if (!newProduct.name.trim() || !newProduct.price || Number(newProduct.price) <= 0) {
        alert("Please enter a valid name and price for the new product.");
        return;
    }
    if (newBatch.inputs.some(i => !i.materialId || !i.quantity)) {
        alert("Please define the input materials for the batch first, as this will become the product's recipe.");
        return;
    }
    const newFinishedProduct = addFinishedProduct({
        name: newProduct.name,
        price: Number(newProduct.price),
        unit: 'units',
        recipe: newBatch.inputs.map(i => ({ materialId: i.materialId, quantity: Number(i.quantity) })),
    });
    if (newFinishedProduct && newFinishedProduct.id) {
        setNewBatch(prev => ({ ...prev, output: { ...prev.output, productId: newFinishedProduct.id }}));
        setNewProduct({ name: '', price: '' });
        setIsAddProductOpen(false);
    } else {
        alert("Error: Could not add new finished product.");
    }
  };


  const columns = [
    { header: 'Batch No.', accessor: 'batchNumber' as keyof ProductionOrder },
    { header: 'Output Product', accessor: (item: ProductionOrder) => getProductName(item.output.productId) },
    { header: 'Output Qty', accessor: (item: ProductionOrder) => item.output.quantity },
    { header: 'Start Date', accessor: 'startDate' as keyof ProductionOrder },
    { header: 'End Date', accessor: (item: ProductionOrder) => item.endDate || 'N/A' },
    { header: 'Status', accessor: (item: ProductionOrder) => statusBadge(item.status) },
    { header: 'Actions', accessor: (item: ProductionOrder) => (
        item.status === 'In Progress' ? (
          <button 
            onClick={() => handleUpdateProductionStatus(item.id, 'Completed')} 
            className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600 transition"
          >
            Mark Completed
          </button>
        ) : null
    )},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-medium text-gray-700">Production Orders</h3>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Start Production Batch</button>
      </div>
      <Table columns={columns} data={productionOrders} />

      <Modal title="Start New Production Batch" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-2">Input Raw Materials</h4>
            <div className="space-y-2">
              {newBatch.inputs.map((input, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Material</label>
                    <select name="materialId" value={input.materialId} onChange={e => handleInputChange('input', index, e)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900">
                      <option value="">Select Material</option>
                      {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name} (In Stock: {m.stock})</option>)}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-sm text-gray-600">Quantity</label>
                    <input type="number" name="quantity" value={input.quantity} onChange={e => handleInputChange('input', index, e)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900" />
                  </div>
                  <button type="button" onClick={() => removeInputMaterial(index)} className="text-red-500 hover:text-red-700 mt-6">&times;</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addInputMaterial} className="text-sm text-indigo-600 hover:text-indigo-800 mt-2">+ Add Material</button>
          </div>

          <div className="border-t pt-4">
             <h4 className="font-semibold text-lg text-gray-800 mb-2">Output Finished Good</h4>
             <div className="flex items-end gap-2 p-2 border rounded">
                <div className="flex-1">
                    <label className="text-sm text-gray-600">Product</label>
                    <select name="productId" value={newBatch.output.productId} onChange={e => handleInputChange('output', 0, e)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900">
                        <option value="">Select Product</option>
                        {finishedProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <button type="button" onClick={() => setIsAddProductOpen(true)} className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">+</button>
                <div className="w-32">
                    <label className="text-sm text-gray-600">Quantity</label>
                    <input type="number" name="quantity" value={newBatch.output.quantity} onChange={e => handleInputChange('output', 0, e)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900" />
                </div>
             </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Start Batch</button>
          </div>
        </form>
      </Modal>

      {/* Add Finished Product Modal */}
      <Modal title="Add New Finished Product" isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)}>
        <div className="space-y-4">
            <p className="text-sm text-gray-600">The recipe for this new product will be based on the input materials defined for the current batch.</p>
            <div>
                <label htmlFor="newProductName" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" id="newProductName" value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
            </div>
            <div>
                <label htmlFor="newProductPrice" className="block text-sm font-medium text-gray-700">Price per Unit</label>
                <input type="number" id="newProductPrice" value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} min="0" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"/>
            </div>
            <div className="flex justify-end pt-2">
            <button type="button" onClick={() => setIsAddProductOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddProductSubmit} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Product</button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
