import React from 'react';
import type { RawMaterial, FinishedProduct } from '../types';
import { Table } from './ui/Table';

interface InventoryProps {
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
}

export const Inventory: React.FC<InventoryProps> = ({ rawMaterials, finishedProducts }) => {
  
  const materialColumns = [
    { header: 'ID', accessor: 'id' as keyof RawMaterial },
    { header: 'Name', accessor: 'name' as keyof RawMaterial },
    { header: 'Stock', accessor: (item: RawMaterial) => `${item.stock.toLocaleString()} ${item.unit}`},
    { header: 'Cost/Unit', accessor: (item: RawMaterial) => `PKR ${item.costPerUnit.toFixed(2)}` },
  ];

  const productColumns = [
    { header: 'ID', accessor: 'id' as keyof FinishedProduct },
    { header: 'Name', accessor: 'name' as keyof FinishedProduct },
    { header: 'Stock', accessor: (item: FinishedProduct) => `${item.stock.toLocaleString()} ${item.unit}` },
    { header: 'Price', accessor: (item: FinishedProduct) => `PKR ${item.price.toFixed(2)}` },
  ];

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">Inventory Status</h3>
      
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Raw Materials</h4>
        <Table columns={materialColumns} data={rawMaterials} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold text-gray-700">Finished Products</h4>
        </div>
        <Table columns={productColumns} data={finishedProducts} />
      </div>
    </div>
  );
};