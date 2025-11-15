import type { RawMaterial, FinishedProduct, PurchaseOrder, ProductionOrder, Sale, Employee, Expense, BankAccount, Supplier, Distributor, ChartOfAccount } from './types';

// New Mock Data
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP001', name: 'Steel Corp' },
  { id: 'SUP002', name: 'Plastics United' },
  { id: 'SUP003', name: 'Chips Inc.' },
  { id: 'SUP004', name: 'Global Chemicals' },
];

export const MOCK_DISTRIBUTORS: Distributor[] = [
  { id: 'DIS001', name: 'DistriCo' },
  { id: 'DIS002', name: 'Global Parts' },
  { id: 'DIS003', name: 'Supply Chain LLC' },
];


// Mock Data
export const MOCK_RAW_MATERIALS: RawMaterial[] = [
  { id: 'RM001', name: 'Steel Coil', stock: 5000, unit: 'kg', costPerUnit: 150 },
  { id: 'RM002', name: 'Plastic Pellets', stock: 10000, unit: 'kg', costPerUnit: 80 },
  { id: 'RM003', name: 'Rubber Compound', stock: 2500, unit: 'kg', costPerUnit: 200 },
  { id: 'RM004', name: 'Microchip', stock: 50000, unit: 'units', costPerUnit: 300 },
  { id: 'RM005', name: 'Aluminum Ingot', stock: 3000, unit: 'kg', costPerUnit: 180 },
];

export const MOCK_FINISHED_PRODUCTS: FinishedProduct[] = [
  { id: 'FP001', name: 'Widget A', stock: 1200, price: 5500, unit: 'units', recipe: [{ materialId: 'RM001', quantity: 2 }, { materialId: 'RM002', quantity: 1 }, { materialId: 'RM004', quantity: 5 }] },
  { id: 'FP002', name: 'Gadget B', stock: 850, price: 7800, unit: 'units', recipe: [{ materialId: 'RM005', quantity: 3 }, { materialId: 'RM002', quantity: 1.5 }, { materialId: 'RM004', quantity: 10 }] },
  { id: 'FP003', name: 'Doohickey C', stock: 2000, price: 3200, unit: 'units', recipe: [{ materialId: 'RM002', quantity: 0.5 }, { materialId: 'RM003', quantity: 0.2 }] },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO001', materialId: 'RM001', quantity: 1000, rate: 150, totalCost: 150000, supplierId: 'SUP001', orderDate: '2023-10-01', status: 'Completed' },
  { id: 'PO002', materialId: 'RM004', quantity: 10000, rate: 300, totalCost: 3000000, supplierId: 'SUP003', orderDate: '2023-10-15', status: 'Completed' },
  { id: 'PO003', materialId: 'RM002', quantity: 2000, rate: 80, totalCost: 160000, supplierId: 'SUP002', orderDate: '2023-11-05', status: 'Pending' },
];

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
    { id: 'PROD001', batchNumber: 'B001', inputs: [{materialId: 'RM001', quantity: 1000}, {materialId: 'RM002', quantity: 500}, {materialId: 'RM004', quantity: 2500}], output: {productId: 'FP001', quantity: 500}, startDate: '2023-10-05', endDate: '2023-10-10', status: 'Completed' },
    { id: 'PROD002', batchNumber: 'B002', inputs: [{materialId: 'RM005', quantity: 900}, {materialId: 'RM002', quantity: 450}, {materialId: 'RM004', quantity: 3000}], output: {productId: 'FP002', quantity: 300}, startDate: '2023-10-20', endDate: '2023-10-25', status: 'Completed' },
    { id: 'PROD003', batchNumber: 'B003', inputs: [{materialId: 'RM002', quantity: 500}, {materialId: 'RM003', quantity: 200}], output: {productId: 'FP003', quantity: 1000}, startDate: '2023-11-01', endDate: null, status: 'In Progress' },
];

export const MOCK_SALES: Sale[] = [
  { id: 'S001', productId: 'FP001', quantity: 200, rate: 5500, totalRevenue: 1100000, distributorId: 'DIS001', saleDate: '2023-10-12', paymentMethod: 'Cash', status: 'Paid' },
  { id: 'S002', productId: 'FP002', quantity: 150, rate: 7800, totalRevenue: 1170000, distributorId: 'DIS002', saleDate: '2023-10-28', paymentMethod: 'Cash', status: 'Paid' },
  { id: 'S003', productId: 'FP003', quantity: 500, rate: 3200, totalRevenue: 1600000, distributorId: 'DIS003', saleDate: '2023-11-03', paymentMethod: 'Credit', status: 'Unpaid' },
  { id: 'S004', productId: 'FP001', quantity: 100, rate: 5500, totalRevenue: 550000, distributorId: 'DIS001', saleDate: '2023-11-06', paymentMethod: 'Credit', status: 'Unpaid' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP001', name: 'Ali Khan', role: 'Production Manager', salary: 150000 },
  { id: 'EMP002', name: 'Fatima Ahmed', role: 'Accountant', salary: 120000 },
  { id: 'EMP003', name: 'Bilal Chaudhry', role: 'Sales Executive', salary: 90000 },
  { id: 'EMP004', name: 'Sana Iqbal', role: 'Inventory Clerk', salary: 75000 },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP001', category: 'Rent', description: 'Factory Rent for October', amount: 200000, date: '2023-10-05' },
  { id: 'EXP002', category: 'Utilities', description: 'Electricity Bill', amount: 55000, date: '2023-10-15' },
  { id: 'EXP003', category: 'Marketing', description: 'Social Media Campaign', amount: 30000, date: '2023-10-20' },
  { id: 'EXP004', category: 'Supplies', description: 'Office Supplies', amount: 15000, date: '2023-11-02' },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'BA001', accountName: 'HBL Main Branch', accountNumber: '...1234', balance: 5450000 },
  { id: 'BA002', accountName: 'Meezan Bank Corporate', accountNumber: '...5678', balance: 12300000 },
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
    { id: 'COA001', accountName: 'Cash and Bank', type: 'Asset' },
    { id: 'COA002', accountName: 'Accounts Receivable', type: 'Asset' },
    { id: 'COA003', accountName: 'Inventory', type: 'Asset' },
    { id: 'COA004', accountName: 'Accounts Payable', type: 'Liability' },
    { id: 'COA005', accountName: 'Owner\'s Equity', type: 'Equity' },
    { id: 'COA006', accountName: 'Sales Revenue', type: 'Revenue' },
    // FIX: Changed 'name' to 'accountName' to match ChartOfAccount type definition.
    { id: 'COA007', accountName: 'Cost of Goods Sold', type: 'Expense' },
    // FIX: Changed 'name' to 'accountName' to match ChartOfAccount type definition.
    { id: 'COA008', accountName: 'Rent Expense', type: 'Expense' },
    // FIX: Changed 'name' to 'accountName' to match ChartOfAccount type definition.
    { id: 'COA009', accountName: 'Salaries Expense', type: 'Expense' },
];
