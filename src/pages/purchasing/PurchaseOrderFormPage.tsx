import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardCheck, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { InputField, SelectField, TextareaField } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNotification } from '../../hooks/useNotification';
import { FREIGHT_TYPES, PROJECTS, UOM_OPTIONS } from '../../data/options';
import { useAppData } from '../../hooks/useAppData';
import type { PurchaseOrder, PurchaseOrderItem } from '../../types/domain';
import { formatCurrency, joinAddress, makeId } from '../../utils/format';
import {
  purchaseOrderItemSchema,
  purchaseOrderSchema,
  type PurchaseOrderFormValues,
  type PurchaseOrderItemFormValues,
} from '../../utils/schemas';

const today = new Date().toISOString().slice(0, 10);

const orderDefaults: PurchaseOrderFormValues = {
  purchaseOrderNumber: '',
  orderedDate: today,
  freightType: 'Standard',
  currency: 'LKR',
  endUserProjectDetails: '',
  orderDueDate: today,
  paymentTerm: '',
  deliverProject: '',
  deliverLocation: '',
  supplierCode: '',
};

const itemDefaults: PurchaseOrderItemFormValues = {
  stockCode: '',
  description: '',
  uom: '',
  quantity: 1,
  unitPrice: 0,
};

export function PurchaseOrderFormPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppData();
  const { notify } = useNotification();
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const orderForm = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: orderDefaults,
    mode: 'onBlur',
  });

  const itemForm = useForm<PurchaseOrderItemFormValues>({
    resolver: zodResolver(purchaseOrderItemSchema),
    defaultValues: itemDefaults,
    mode: 'onBlur',
  });

  const selectedProjectName = useWatch({ control: orderForm.control, name: 'deliverProject' });
  const selectedSupplierCode = useWatch({ control: orderForm.control, name: 'supplierCode' });
  const selectedStockCode = useWatch({ control: itemForm.control, name: 'stockCode' });
  const selectedCurrency = useWatch({ control: orderForm.control, name: 'currency' }) ?? 'LKR';

  const selectedSupplier = state.suppliers.find(
    (supplier) => supplier.supplierCode === selectedSupplierCode,
  );
  const selectedStock = state.stocks.find((stock) => stock.stockCode === selectedStockCode);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  useEffect(() => {
    const project = PROJECTS.find((candidate) => candidate.name === selectedProjectName);
    orderForm.setValue('deliverLocation', project?.location ?? '', { shouldValidate: true });
  }, [orderForm, selectedProjectName]);

  useEffect(() => {
    if (!selectedStock) return;
    itemForm.setValue('description', selectedStock.description, { shouldValidate: true });
    itemForm.setValue('uom', selectedStock.uom, { shouldValidate: true });
    itemForm.setValue('unitPrice', selectedStock.unitPrice, { shouldValidate: true });
  }, [itemForm, selectedStock]);

  const addItem = (values: PurchaseOrderItemFormValues) => {
    const duplicate = items.some((item) => item.stockCode === values.stockCode);
    if (duplicate) {
      itemForm.setError('stockCode', { message: 'This stock item is already in the order' });
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: makeId('po-item'),
        ...values,
        amount: values.quantity * values.unitPrice,
      },
    ]);
    itemForm.reset(itemDefaults);
  };

  const saveOrder = (values: PurchaseOrderFormValues) => {
    if (items.length === 0) {
      notify('Add at least one purchase order item before saving.');
      return;
    }

    const duplicate = state.purchaseOrders.some(
      (order) =>
        order.purchaseOrderNumber.toLowerCase() === values.purchaseOrderNumber.toLowerCase(),
    );
    if (duplicate) {
      orderForm.setError('purchaseOrderNumber', {
        message: 'This purchase order number already exists',
      });
      return;
    }

    if (!selectedSupplier) {
      orderForm.setError('supplierCode', { message: 'Select a valid supplier' });
      return;
    }

    const order: PurchaseOrder = {
      ...values,
      purchaseOrderNumber: values.purchaseOrderNumber.toUpperCase(),
      supplierName: selectedSupplier.supplierName,
      supplierAddress: joinAddress([
        selectedSupplier.addressLine1,
        selectedSupplier.addressLine2,
        selectedSupplier.city,
      ]),
      items,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_PURCHASE_ORDER', payload: order });
    notify('Purchase order created successfully.');
    void navigate('/purchasing/orders');
  };

  const itemColumns: Column<PurchaseOrderItem>[] = [
    { key: 'code', header: 'Stock code', cell: (item) => <strong>{item.stockCode}</strong> },
    { key: 'description', header: 'Description', cell: (item) => item.description },
    { key: 'uom', header: 'UOM', cell: (item) => item.uom },
    { key: 'quantity', header: 'Quantity', align: 'right', cell: (item) => item.quantity },
    { key: 'price', header: 'Unit price', align: 'right', cell: (item) => formatCurrency(item.unitPrice, selectedCurrency) },
    { key: 'amount', header: 'Amount', align: 'right', cell: (item) => <strong>{formatCurrency(item.amount, selectedCurrency)}</strong> },
    {
      key: 'remove',
      header: '',
      align: 'right',
      cell: (item) => (
        <button
          className="table-action table-action--danger"
          type="button"
          onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}
          aria-label={`Remove ${item.stockCode}`}
        >
          <Trash2 size={16} /> Remove
        </button>
      ),
    },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Purchasing Department · Purchase Order"
        title="Create purchase order"
        description="Complete initial details, select a supplier, add order items, and review the total before saving."
      />

      <form onSubmit={orderForm.handleSubmit(saveOrder)} noValidate>
        <div className="page-stack">
          <Card title="1. Initial details" description="Order, delivery, and payment information.">
            <div className="form-grid form-grid--two">
              <InputField
                label="Purchase order number"
                placeholder="e.g. PO-2026-0013"
                error={orderForm.formState.errors.purchaseOrderNumber?.message}
                required
                {...orderForm.register('purchaseOrderNumber')}
              />
              <InputField
                label="Ordered date"
                type="date"
                error={orderForm.formState.errors.orderedDate?.message}
                required
                {...orderForm.register('orderedDate')}
              />
              <SelectField
                label="Freight type"
                error={orderForm.formState.errors.freightType?.message}
                required
                {...orderForm.register('freightType')}
              >
                {FREIGHT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </SelectField>
              {/* currency selector moved to the PO items section so it sits next to unit price */}
              <InputField
                label="Order due date"
                type="date"
                min={useWatch({ control: orderForm.control, name: 'orderedDate' })}
                error={orderForm.formState.errors.orderDueDate?.message}
                required
                {...orderForm.register('orderDueDate')}
              />
              <InputField
                label="Payment term"
                placeholder="e.g. 30 days from invoice"
                error={orderForm.formState.errors.paymentTerm?.message}
                required
                {...orderForm.register('paymentTerm')}
              />
              <SelectField
                label="Deliver project"
                error={orderForm.formState.errors.deliverProject?.message}
                required
                {...orderForm.register('deliverProject')}
              >
                {PROJECTS.map((project) => <option key={project.name} value={project.name}>{project.name}</option>)}
              </SelectField>
              <InputField
                label="Deliver location"
                readOnly
                error={orderForm.formState.errors.deliverLocation?.message}
                required
                {...orderForm.register('deliverLocation')}
              />
              <div className="form-grid__full">
                <TextareaField
                  label="End-user project details"
                  rows={3}
                  error={orderForm.formState.errors.endUserProjectDetails?.message}
                  required
                  {...orderForm.register('endUserProjectDetails')}
                />
              </div>
            </div>
          </Card>

          <Card title="2. Supplier details" description="Supplier name and address are automatically populated.">
            <div className="form-grid form-grid--two">
              <SelectField
                label="Supplier code"
                error={orderForm.formState.errors.supplierCode?.message}
                required
                {...orderForm.register('supplierCode')}
              >
                {state.suppliers.filter((supplier) => supplier.status === 'Active').map((supplier) => (
                  <option key={supplier.supplierCode} value={supplier.supplierCode}>
                    {supplier.supplierCode} — {supplier.supplierName}
                  </option>
                ))}
              </SelectField>
              <InputField label="Supplier name" value={selectedSupplier?.supplierName ?? ''} readOnly disabled />
              <div className="form-grid__full">
                <InputField
                  label="Supplier address"
                  value={selectedSupplier ? joinAddress([selectedSupplier.addressLine1, selectedSupplier.addressLine2, selectedSupplier.city]) : ''}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </Card>

          <Card title="3. Purchase order items" description="Select stock items and enter the requested quantity.">
            <div className="form-grid form-grid--three po-item-form">
              <SelectField
                label="Stock code"
                error={itemForm.formState.errors.stockCode?.message}
                required
                {...itemForm.register('stockCode')}
              >
                {state.stocks.filter((stock) => stock.status === 'Active').map((stock) => (
                  <option key={stock.stockCode} value={stock.stockCode}>
                    {stock.stockCode} — {stock.description}
                  </option>
                ))}
              </SelectField>
              <InputField
                label="Description"
                error={itemForm.formState.errors.description?.message}
                required
                {...itemForm.register('description')}
              />
              <SelectField label="UOM" error={itemForm.formState.errors.uom?.message} required {...itemForm.register('uom')}>
                {UOM_OPTIONS.map((uom) => <option key={uom} value={uom}>{uom}</option>)}
              </SelectField>
              <SelectField
                label="Currency"
                error={orderForm.formState.errors.currency?.message}
                required
                {...orderForm.register('currency')}
              >
                <option value="LKR">LKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </SelectField>
              <InputField
                label="Quantity"
                type="number"
                min="1"
                step="1"
                error={itemForm.formState.errors.quantity?.message}
                required
                {...itemForm.register('quantity', { valueAsNumber: true })}
              />
              <InputField
                label={`Unit price (${selectedCurrency})`}
                type="number"
                min="0"
                step="0.01"
                error={itemForm.formState.errors.unitPrice?.message}
                required
                {...itemForm.register('unitPrice', { valueAsNumber: true })}
              />
              <div className="field field--button">
                <span className="field__label" aria-hidden="true">Item action</span>
                <Button
                  type="button"
                  icon={<Plus size={17} />}
                  onClick={itemForm.handleSubmit(addItem)}
                  fullWidth
                >
                  Add item
                </Button>
              </div>
            </div>

            <div className="po-items-table">
              {items.length ? (
                <DataTable columns={itemColumns} rows={items} getRowKey={(item) => item.id} caption="Purchase order items" />
              ) : (
                <EmptyState title="No order items" description="Select a stock code and add the first item to this purchase order." />
              )}
            </div>

            <div className="po-total" aria-label="Purchase order total">
              <span>Total amount</span>
              <strong>{formatCurrency(totalAmount, selectedCurrency)}</strong>
            </div>
          </Card>

          <div className="sticky-actions">
            <div>
              <strong>{items.length} item(s)</strong>
              <span>{formatCurrency(totalAmount, selectedCurrency)} total</span>
            </div>
            <div className="form-actions form-actions--flush">
              <Button type="submit" icon={<ClipboardCheck size={17} />}>Save purchase order</Button>
              <Button variant="secondary" icon={<XCircle size={17} />} onClick={() => void navigate('/purchasing/orders')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
