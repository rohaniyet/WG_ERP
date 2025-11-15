export type View = 'DASHBOARD' | 'PURCHASES' | 'PRODUCTION' | 'INVENTORY' | 'SALES' | 'ACCOUNTS' | 'INSIGHTS';

export interface RawMaterial {
  id: string;
  name: string;
  stock: number;
  unit: 'kg' | 'liters' | 'units';
  costPerUnit: number;
}

export interface FinishedProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
  unit: 'units';
  recipe: { materialId: string; quantity: number }[];
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Distributor {
  id: string;
  name: string;
}

export type OrderStatus = 'Pending' | 'Completed' | 'In Progress' | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  materialId: string;
  quantity: number;
  rate: number;
  totalCost: number;
  supplierId: string;
  orderDate: string;
  status: OrderStatus;
}

export interface ProductionOrder {
  id: string;
  batchNumber: string;
  inputs: { materialId: string; quantity: number }[];
  output: { productId: string; quantity: number };
  startDate: string;
  endDate: string | null;
  status: OrderStatus;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  rate: number;
  totalRevenue: number;
  distributorId: string;
  saleDate: string;
  paymentMethod: 'Cash' | 'Credit';
  status: 'Paid' | 'Unpaid';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number; // Monthly salary
}

export interface Expense {
  id: string;
  category: 'Utilities' | 'Rent' | 'Marketing' | 'Supplies' | 'Other';
  description: string;
  amount: number;
  date: string;
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string; // last 4 digits for display
  balance: number;
}

// Accounting Specific Types
export interface ChartOfAccount {
  id: string;
  accountName: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
}

export type LedgerEntryType = 'Purchase' | 'Sale' | 'Expense' | 'Salary';

export interface LedgerEntry {
  id: string;
  date: string;
  account: string; // Name of supplier, distributor, employee, or expense category
  description: string;
  debit: number;
  credit: number;
  type: LedgerEntryType;
}


export interface BusinessData {
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  purchaseOrders: PurchaseOrder[];
  productionOrders: ProductionOrder[];
  sales: Sale[];
  employees: Employee[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  suppliers: Supplier[];
  distributors: Distributor[];
}