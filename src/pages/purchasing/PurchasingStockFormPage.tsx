import { zodResolver } from '@hookform/resolvers/zod';
import { Save, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputField, SelectField, TextareaField } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNotification } from '../../hooks/useNotification';
import { STOCK_CATEGORIES, STOCK_TYPES, UOM_OPTIONS } from '../../data/options';
import { useAppData } from '../../hooks/useAppData';
import type { StockItem } from '../../types/domain';
import { stockSchema, type StockFormValues } from '../../utils/schemas';

const defaultValues: StockFormValues = {
  stockCode: '',
  stockType: '',
  category: '',
  uom: '',
  unitPrice: 0,
  description: '',
  status: 'Active',
};

export function PurchasingStockFormPage() {
  const { stockCode } = useParams();
  const isEditing = Boolean(stockCode);
  const navigate = useNavigate();
  const { state, dispatch } = useAppData();
  const { notify } = useNotification();
  const existingStock = state.stocks.find((stock) => stock.stockCode === stockCode);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!existingStock) return;
    reset({
      stockCode: existingStock.stockCode,
      stockType: existingStock.stockType,
      category: existingStock.category,
      uom: existingStock.uom,
      unitPrice: existingStock.unitPrice,
      description: existingStock.description,
      status: existingStock.status,
    });
  }, [existingStock, reset]);

  const submit = (values: StockFormValues) => {
    const duplicate = state.stocks.some(
      (stock) => stock.stockCode.toLowerCase() === values.stockCode.toLowerCase() &&
        stock.stockCode !== existingStock?.stockCode,
    );

    if (duplicate) {
      setError('stockCode', { message: 'This stock code is already registered' });
      return;
    }

    const now = new Date().toISOString();
    const item: StockItem = {
      ...values,
      stockCode: values.stockCode.toUpperCase(),
      availableQuantity: existingStock?.availableQuantity ?? 0,
      lastReceivedQuantity: existingStock?.lastReceivedQuantity ?? 0,
      lastReceivedDate: existingStock?.lastReceivedDate ?? null,
      createdAt: existingStock?.createdAt ?? now,
      updatedAt: now,
    };

    dispatch({ type: isEditing ? 'UPDATE_STOCK' : 'ADD_STOCK', payload: item });
    notify(isEditing ? 'Stock item updated successfully.' : 'Stock item added successfully.');
    void navigate('/purchasing/stocks');
  };

  if (isEditing && !existingStock) {
    return (
      <div className="page-stack">
        <PageHeader title="Stock item not found" description="The requested stock record does not exist." />
        <Button variant="secondary" onClick={() => void navigate('/purchasing/stocks')}>Back to stock list</Button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Purchasing · Stock Reference"
        title={isEditing ? `Edit ${existingStock?.stockCode}` : 'Add stock entry'}
        description="Create a reference stock master record for purchasing. Quantity is updated separately when goods are received."
      />

      <form onSubmit={handleSubmit(submit)} noValidate>
        <Card title="Stock details" description="Fields marked with an asterisk are required.">
          <div className="form-grid form-grid--two">
            <InputField label="Stock code" placeholder="e.g. STK-005" error={errors.stockCode?.message} required disabled={isEditing} autoComplete="off" {...register('stockCode')} />
            <SelectField label="Stock type" error={errors.stockType?.message} required {...register('stockType')}>
              {STOCK_TYPES.map((value) => <option key={value} value={value}>{value}</option>)}
            </SelectField>
            <SelectField label="Category" error={errors.category?.message} required {...register('category')}>
              {STOCK_CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}
            </SelectField>
            <SelectField label="UOM" error={errors.uom?.message} required {...register('uom')}>
              {UOM_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
            </SelectField>
            <InputField label="Unit price (LKR)" type="number" min="0" step="0.01" error={errors.unitPrice?.message} required {...register('unitPrice', { valueAsNumber: true })} />
            <SelectField label="Status" error={errors.status?.message} required {...register('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </SelectField>
            <div className="form-grid__full">
              <TextareaField label="Description" rows={4} placeholder="Describe the stock item" error={errors.description?.message} required {...register('description')} />
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" icon={<Save size={17} />} disabled={isSubmitting || (isEditing && !isDirty)}>{isEditing ? 'Save changes' : 'Save stock entry'}</Button>
            <Button variant="secondary" icon={<XCircle size={17} />} onClick={() => void navigate('/purchasing/stocks')}>Cancel</Button>
            {!isEditing ? <Button variant="ghost" onClick={() => reset(defaultValues)}>Clear</Button> : null}
          </div>
        </Card>
      </form>
    </div>
  );
}
