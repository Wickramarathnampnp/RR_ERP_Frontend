import { zodResolver } from '@hookform/resolvers/zod';
import { PackageCheck, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputField, SelectField } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNotification } from '../../hooks/useNotification';
import { useAppData } from '../../hooks/useAppData';
import { stockReceiptSchema, type StockReceiptFormValues } from '../../utils/schemas';
import { formatCurrency } from '../../utils/format';

const today = new Date().toISOString().slice(0, 10);

export function UpdateQuantityPage() {
  const { state, dispatch } = useAppData();
  const { notify } = useNotification();
  const {
    register,
    handleSubmit,
    reset,
    control: formControl,
    formState: { errors },
  } = useForm<StockReceiptFormValues>({
    resolver: zodResolver(stockReceiptSchema),
    defaultValues: { stockCode: '', receivedQuantity: 1, receivedDate: today },
  });

  const selectedCode = useWatch({ control: formControl, name: 'stockCode' });
  const selectedStock = state.stocks.find((stock) => stock.stockCode === selectedCode);

  useEffect(() => {
    if (selectedCode && !selectedStock) reset({ stockCode: '', receivedQuantity: 1, receivedDate: today });
  }, [reset, selectedCode, selectedStock]);

  const submit = (values: StockReceiptFormValues) => {
    dispatch({ type: 'RECEIVE_STOCK', payload: values });
    notify(`${values.receivedQuantity} unit(s) received for ${values.stockCode}.`);
    reset({ stockCode: '', receivedQuantity: 1, receivedDate: today });
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Warehouse · Quantity Management"
        title="Update stock quantity"
        description="Select a stock item, review its current details, and record the quantity received."
      />

      <form onSubmit={handleSubmit(submit)} noValidate>
        <Card title="Stock receipt" description="Auto-filled fields are read-only and come from the stock master.">
          <div className="form-grid form-grid--two">
            <SelectField label="Stock code" error={errors.stockCode?.message} required {...register('stockCode')}>
              {state.stocks.filter((stock) => stock.status === 'Active').map((stock) => (
                <option key={stock.stockCode} value={stock.stockCode}>
                  {stock.stockCode} — {stock.description}
                </option>
              ))}
            </SelectField>
            <InputField label="Stock type" value={selectedStock?.stockType ?? ''} readOnly disabled />
            <InputField label="Category" value={selectedStock?.category ?? ''} readOnly disabled />
            <InputField label="UOM" value={selectedStock?.uom ?? ''} readOnly disabled />
            <InputField label="Unit price" value={selectedStock ? formatCurrency(selectedStock.unitPrice) : ''} readOnly disabled />
            <InputField label="Available quantity" value={selectedStock?.availableQuantity ?? ''} readOnly disabled />
            <InputField
              label="Received quantity"
              type="number"
              min="1"
              step="1"
              error={errors.receivedQuantity?.message}
              required
              {...register('receivedQuantity', { valueAsNumber: true })}
            />
            <InputField
              label="Received date"
              type="date"
              max={today}
              error={errors.receivedDate?.message}
              required
              {...register('receivedDate')}
            />
          </div>
          <div className="form-actions">
            <Button type="submit" icon={<PackageCheck size={17} />} disabled={!selectedStock}>Save receipt</Button>
            <Button
              variant="secondary"
              icon={<XCircle size={17} />}
              onClick={() => reset({ stockCode: '', receivedQuantity: 1, receivedDate: today })}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
