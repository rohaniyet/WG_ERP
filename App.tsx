
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Purchases } from './components/Purchases';
import { Production } from './components/Production';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { Accounts } from './components/Accounts';
import { Insights } from './components/Insights';
import type { View, RawMaterial, FinishedProduct, PurchaseOrder, ProductionOrder, Sale, Employee, Expense, BankAccount, Supplier, Distributor, OrderStatus } from './types';
import { MOCK_RAW_MATERIALS, MOCK_FINISHED_PRODUCTS, MOCK_PURCHASE_ORDERS, MOCK_PRODUCTION_ORDERS, MOCK_SALES, MOCK_EMPLOYEES, MOCK_EXPENSES, MOCK_BANK_ACCOUNTS, MOCK_SUPPLIERS, MOCK_DISTRIBUTORS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Mocked data state
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(MOCK_RAW_MATERIALS);
  const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>(MOCK_FINISHED_PRODUCTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(MOCK_PRODUCTION_ORDERS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [distributors, setDistributors] = useState<Distributor[]>(MOCK_DISTRIBUTORS);

  const businessData = useMemo(() => ({
    rawMaterials,
    finishedProducts,
    purchaseOrders,
    productionOrders,
    sales,
    employees,
    expenses,
    bankAccounts,
    suppliers,
    distributors
  }), [rawMaterials, finishedProducts, purchaseOrders, productionOrders, sales, employees, expenses, bankAccounts, suppliers, distributors]);

  const handleAddPurchase = (order: Omit<PurchaseOrder, 'id'>) => {
    const newOrder: PurchaseOrder = {
      ...order,
      id: `PO${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
    }
    setPurchaseOrders(prev => [...prev, newOrder]);
    // Increase stock of raw material
    setRawMaterials(prev => prev.map(rm => 
      rm.id === newOrder.materialId ? { ...rm, stock: rm.stock + newOrder.quantity } : rm
    ));
  };

  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: `S${(sales.length + 1).toString().padStart(3, '0')}`,
    }
    setSales(prev => [...prev, newSale]);
    // Decrease stock of finished product
    setFinishedProducts(prev => prev.map(fp =>
      fp.id === newSale.productId ? { ...fp, stock: fp.stock - newSale.quantity } : fp
    ));
  };

  const handleAddProduction = (order: Omit<ProductionOrder, 'id' | 'batchNumber'>) => {
    const newOrder: ProductionOrder = {
      ...order,
      id: `PROD${(productionOrders.length + 1).toString().padStart(3, '0')}`,
      batchNumber: `B${(productionOrders.length + 1).toString().padStart(3, '0')}`,
    };
    setProductionOrders(prev => [...prev, newOrder]);
    
    // Decrease stock of raw materials used
    setRawMaterials(prev => {
      const materialsCopy = [...prev];
      newOrder.inputs.forEach(input => {
        const materialIndex = materialsCopy.findIndex(m => m.id === input.materialId);
        if (materialIndex > -1) {
          materialsCopy[materialIndex].stock -= input.quantity;
        }
      });
      return materialsCopy;
    });

    // Increase stock of finished product
    setFinishedProducts(prev => prev.map(fp =>
      fp.id === newOrder.output.productId ? { ...fp, stock: fp.stock + newOrder.output.quantity } : fp
    ));
  };

  const handleUpdateProductionStatus = (orderId: string, status: OrderStatus) => {
    setProductionOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status, endDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : null } 
          : order
      )
    );
  };

  const handleAddSupplier = (name: string): Supplier => {
    const newSupplier: Supplier = {
      id: `SUP${(suppliers.length + 1).toString().padStart(3, '0')}`,
      name,
    };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  };

  const handleAddDistributor = (name: string): Distributor => {
    const newDistributor: Distributor = {
      id: `DIS${(distributors.length + 1).toString().padStart(3, '0')}`,
      name,
    };
    setDistributors(prev => [...prev, newDistributor]);
    return newDistributor;
  };

  const handleAddRawMaterial = (material: Omit<RawMaterial, 'id' | 'stock'>): RawMaterial => {
    const newMaterial: RawMaterial = {
      ...material,
      id: `RM${(rawMaterials.length + 1).toString().padStart(3, '0')}`,
      stock: 0,
    };
    setRawMaterials(prev => [...prev, newMaterial]);
    return newMaterial;
  };

  const handleAddFinishedProduct = (product: Omit<FinishedProduct, 'id' | 'stock'>): FinishedProduct => {
    const newProduct: FinishedProduct = {
      ...product,
      id: `FP${(finishedProducts.length + 1).toString().padStart(3, '0')}`,
      stock: 0,
    };
    setFinishedProducts(prev => [...prev, newProduct]);
    return newProduct;
  };


  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard data={businessData} />;
      case 'PURCHASES':
        return <Purchases 
            purchaseOrders={purchaseOrders} 
            addPurchaseOrder={handleAddPurchase} 
            rawMaterials={rawMaterials} 
            suppliers={suppliers} 
            finishedProducts={finishedProducts} 
            distributors={distributors} 
            addSupplier={handleAddSupplier}
            addRawMaterial={handleAddRawMaterial}
        />;
      case 'PRODUCTION':
        return <Production 
          productionOrders={productionOrders} 
          addProductionOrder={handleAddProduction} 
          finishedProducts={finishedProducts} 
          rawMaterials={rawMaterials}
          addFinishedProduct={handleAddFinishedProduct}
          handleUpdateProductionStatus={handleUpdateProductionStatus}
        />;
      case 'INVENTORY':
        return <Inventory rawMaterials={rawMaterials} finishedProducts={finishedProducts} />;
      case 'SALES':
        return <Sales 
          sales={sales} 
          addSale={handleAddSale} 
          finishedProducts={finishedProducts} 
          distributors={distributors} 
          rawMaterials={rawMaterials} 
          suppliers={suppliers}
          addDistributor={handleAddDistributor}
        />;
      case 'ACCOUNTS':
        return <Accounts data={businessData} />;
      case 'INSIGHTS':
        return <Insights businessData={businessData} />;
      default:
        return <Dashboard data={businessData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar view={view} setView={setView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
