import React from 'react';
import type { PurchaseOrder, Sale, RawMaterial, FinishedProduct, Supplier, Distributor } from '../types';

interface PrintableInvoiceProps {
  order: PurchaseOrder | Sale;
  type: 'purchase' | 'sale';
  data: {
      rawMaterials: RawMaterial[],
      finishedProducts: FinishedProduct[],
      suppliers: Supplier[],
      distributors: Distributor[]
  }
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order, type, data }) => {
  const isPurchase = type === 'purchase';
  const purchaseOrder = isPurchase ? order as PurchaseOrder : null;
  const saleOrder = !isPurchase ? order as Sale : null;

  const handlePrint = () => {
    window.print();
  };

  const getPartyDetails = () => {
    if (isPurchase && purchaseOrder) {
      const supplier = data.suppliers.find(s => s.id === purchaseOrder.supplierId);
      return {
        title: 'Supplier',
        name: supplier?.name || 'N/A',
        address: '123 Supplier St, Business City'
      }
    }
    if (!isPurchase && saleOrder) {
        const distributor = data.distributors.find(d => d.id === saleOrder.distributorId);
        return {
            title: 'Customer',
            name: distributor?.name || 'N/A',
            address: '456 Customer Ave, Market Town'
        }
    }
    return { title: 'N/A', name: 'N/A', address: 'N/A' };
  }
  
  const getLineItem = () => {
     if (isPurchase && purchaseOrder) {
        const material = data.rawMaterials.find(m => m.id === purchaseOrder.materialId);
        return {
            description: material?.name || 'N/A',
            quantity: purchaseOrder.quantity,
            rate: purchaseOrder.rate,
            amount: purchaseOrder.totalCost
        };
     }
     if (!isPurchase && saleOrder) {
        const product = data.finishedProducts.find(p => p.id === saleOrder.productId);
        return {
            description: product?.name || 'N/A',
            quantity: saleOrder.quantity,
            rate: saleOrder.rate,
            amount: saleOrder.totalRevenue
        };
     }
     return null;
  }
  
  const party = getPartyDetails();
  const item = getLineItem();

  return (
    <div className="text-gray-900">
        <div id="invoice-content">
            <header className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold">ManuPro Inc.</h1>
                    <p>789 Industrial Park, Manufacturing Hub</p>
                </div>
                <h2 className="text-3xl font-semibold uppercase">{isPurchase ? 'Purchase Invoice' : 'Sale Invoice'}</h2>
            </header>
            <main className="my-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-1">{party.title}</h3>
                        <p className="font-bold">{party.name}</p>
                        <p>{party.address}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-semibold">Invoice #:</span> {order.id}</p>
                        <p><span className="font-semibold">Date:</span> {isPurchase ? purchaseOrder?.orderDate : saleOrder?.saleDate}</p>
                    </div>
                </div>
                <div className="mt-8">
                    <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                        <th className="px-4 py-2 text-left font-semibold">Description</th>
                        <th className="px-4 py-2 text-right font-semibold">Quantity</th>
                        <th className="px-4 py-2 text-right font-semibold">Rate (PKR)</th>
                        <th className="px-4 py-2 text-right font-semibold">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item && (
                            <tr className="border-b">
                                <td className="px-4 py-2">{item.description}</td>
                                <td className="px-4 py-2 text-right">{item.quantity.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{item.rate.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{item.amount.toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-6">
                    <div className="w-1/3">
                        <div className="flex justify-between py-2">
                            <span className="font-semibold">Subtotal:</span>
                            <span>PKR {item?.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t">
                            <span className="font-bold text-lg">Total:</span>
                            <span className="font-bold text-lg">PKR {item?.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="pt-4 border-t text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
            </footer>
        </div>
        <div className="flex justify-end pt-4 mt-4 border-t print:hidden">
            <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Print Invoice
            </button>
        </div>
        <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-content, #invoice-content * {
              visibility: visible;
            }
            #invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};