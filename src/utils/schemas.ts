import { z } from 'zod';

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, `${label} is required`);

export const stockSchema = z.object({
  stockCode: requiredText('Stock code', 2).max(30),
  stockType: requiredText('Stock type'),
  category: requiredText('Category'),
  uom: requiredText('UOM'),
  unitPrice: z.number().finite().min(0, 'Unit price cannot be negative'),
  description: requiredText('Description', 3).max(500),
  status: z.enum(['Active', 'Inactive']),
});

export type StockFormValues = z.infer<typeof stockSchema>;

export const supplierSchema = z.object({
  supplierCode: requiredText('Supplier code', 2).max(30),
  supplierName: requiredText('Supplier name', 2).max(120),
  addressLine1: requiredText('Address line 1', 2).max(150),
  addressLine2: z.string().trim().max(150),
  city: requiredText('City', 2).max(80),
  emailAddress: z.email('Enter a valid email address'),
  phoneNumber: requiredText('Phone number', 7).max(30),
  telephoneNumber: z.string().trim().max(30),
  description: z.string().trim().max(500),
  taxRegistrationNumber: z.string().trim().max(60),
  bankName: z.string().trim().max(100),
  bankAccountNumber: z.string().trim().max(60),
  status: z.enum(['Active', 'Inactive']),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export const stockReceiptSchema = z.object({
  stockCode: requiredText('Stock code'),
  receivedQuantity: z.number().finite().positive('Received quantity must be greater than zero'),
  receivedDate: requiredText('Received date'),
});

export type StockReceiptFormValues = z.infer<typeof stockReceiptSchema>;

export const purchaseOrderSchema = z
  .object({
    purchaseOrderNumber: requiredText('Purchase order number', 2).max(40),
    orderedDate: requiredText('Ordered date'),
    freightType: z.enum(['Standard', 'Express', 'Supplier Delivery', 'Pickup']),
    endUserProjectDetails: requiredText('End-user project details', 3).max(250),
    orderDueDate: requiredText('Order due date'),
    paymentTerm: requiredText('Payment term', 2).max(120),
    deliverProject: requiredText('Delivery project'),
    deliverLocation: requiredText('Delivery location'),
    supplierCode: requiredText('Supplier'),
    currency: z.enum(['LKR','USD','EUR']),
  })
  .refine((values) => values.orderDueDate >= values.orderedDate, {
    message: 'Order due date must be on or after the ordered date',
    path: ['orderDueDate'],
  });

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

export const purchaseOrderItemSchema = z.object({
  stockCode: requiredText('Stock code'),
  description: requiredText('Description', 2).max(250),
  uom: requiredText('UOM'),
  quantity: z.number().finite().positive('Quantity must be greater than zero'),
  unitPrice: z.number().finite().min(0, 'Unit price cannot be negative'),
});

export type PurchaseOrderItemFormValues = z.infer<typeof purchaseOrderItemSchema>;
