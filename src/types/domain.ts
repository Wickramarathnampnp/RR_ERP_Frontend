export type EntityStatus = 'Active' | 'Inactive';

export interface StockItem {
  stockCode: string;
  stockType: string;
  category: string;
  uom: string;
  unitPrice: number;
  description: string;
  status: EntityStatus;
  availableQuantity: number;
  lastReceivedQuantity: number;
  lastReceivedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  supplierCode: string;
  supplierName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  emailAddress: string;
  phoneNumber: string;
  telephoneNumber: string;
  description: string;
  taxRegistrationNumber: string;
  bankName: string;
  bankAccountNumber: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export type FreightType = 'Standard' | 'Express' | 'Supplier Delivery' | 'Pickup';

export interface PurchaseOrderItem {
  id: string;
  stockCode: string;
  description: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PurchaseOrder {
  purchaseOrderNumber: string;
  orderedDate: string;
  freightType: FreightType;
  endUserProjectDetails: string;
  orderDueDate: string;
  paymentTerm: string;
  deliverProject: string;
  deliverLocation: string;
  supplierCode: string;
  supplierName: string;
  supplierAddress: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface AppDataState {
  stocks: StockItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
}

export type AppDataAction =
  | { type: 'ADD_STOCK'; payload: StockItem }
  | { type: 'UPDATE_STOCK'; payload: StockItem }
  | {
      type: 'RECEIVE_STOCK';
      payload: { stockCode: string; receivedQuantity: number; receivedDate: string };
    }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'UPDATE_SUPPLIER'; payload: Supplier }
  | { type: 'ADD_PURCHASE_ORDER'; payload: PurchaseOrder }
  | { type: 'RESET_DEMO_DATA'; payload: AppDataState };
