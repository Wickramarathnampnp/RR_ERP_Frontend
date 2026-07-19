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
import { useAppData } from '../../hooks/useAppData';
import type { Supplier } from '../../types/domain';
import { supplierSchema, type SupplierFormValues } from '../../utils/schemas';

const defaultValues: SupplierFormValues = {
  supplierCode: '',
  supplierName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  emailAddress: '',
  phoneNumber: '',
  telephoneNumber: '',
  description: '',
  taxRegistrationNumber: '',
  bankName: '',
  bankAccountNumber: '',
  status: 'Active',
};

export function SupplierFormPage() {
  const { supplierCode } = useParams();
  const isEditing = Boolean(supplierCode);
  const navigate = useNavigate();
  const { state, dispatch } = useAppData();
  const { notify } = useNotification();
  const existingSupplier = state.suppliers.find(
    (supplier) => supplier.supplierCode === supplierCode,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!existingSupplier) return;
    reset({
      supplierCode: existingSupplier.supplierCode,
      supplierName: existingSupplier.supplierName,
      addressLine1: existingSupplier.addressLine1,
      addressLine2: existingSupplier.addressLine2,
      city: existingSupplier.city,
      emailAddress: existingSupplier.emailAddress,
      phoneNumber: existingSupplier.phoneNumber,
      telephoneNumber: existingSupplier.telephoneNumber,
      description: existingSupplier.description,
      taxRegistrationNumber: existingSupplier.taxRegistrationNumber,
      bankName: existingSupplier.bankName,
      bankAccountNumber: existingSupplier.bankAccountNumber,
      status: existingSupplier.status,
    });
  }, [existingSupplier, reset]);

  const submit = (values: SupplierFormValues) => {
    const duplicate = state.suppliers.some(
      (supplier) =>
        supplier.supplierCode.toLowerCase() === values.supplierCode.toLowerCase() &&
        supplier.supplierCode !== existingSupplier?.supplierCode,
    );

    if (duplicate) {
      setError('supplierCode', { message: 'This supplier code is already registered' });
      return;
    }

    const now = new Date().toISOString();
    const supplier: Supplier = {
      ...values,
      supplierCode: values.supplierCode.toUpperCase(),
      createdAt: existingSupplier?.createdAt ?? now,
      updatedAt: now,
    };

    dispatch({ type: isEditing ? 'UPDATE_SUPPLIER' : 'ADD_SUPPLIER', payload: supplier });
    notify(isEditing ? 'Supplier updated successfully.' : 'Supplier added successfully.');
    void navigate('/warehouse/suppliers');
  };

  if (isEditing && !existingSupplier) {
    return (
      <div className="page-stack">
        <PageHeader title="Supplier not found" description="The requested supplier record does not exist." />
        <Button variant="secondary" onClick={() => void navigate('/warehouse/suppliers')}>Back to suppliers</Button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Warehouse · Supplier Management"
        title={isEditing ? `Edit ${existingSupplier?.supplierCode}` : 'Add supplier'}
        description="Maintain contact, tax registration, and bank information for approved suppliers."
      />

      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="page-stack">
          <Card title="Supplier details" description="General supplier and contact information.">
            <div className="form-grid form-grid--two">
              <InputField
                label="Supplier code"
                placeholder="e.g. SUP-003"
                error={errors.supplierCode?.message}
                required
                disabled={isEditing}
                {...register('supplierCode')}
              />
              <InputField
                label="Supplier name"
                error={errors.supplierName?.message}
                required
                {...register('supplierName')}
              />
              <InputField
                label="Address line 1"
                error={errors.addressLine1?.message}
                required
                {...register('addressLine1')}
              />
              <InputField
                label="Address line 2"
                error={errors.addressLine2?.message}
                {...register('addressLine2')}
              />
              <InputField label="City" error={errors.city?.message} required {...register('city')} />
              <InputField
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.emailAddress?.message}
                required
                {...register('emailAddress')}
              />
              <InputField
                label="Phone number"
                type="tel"
                autoComplete="tel"
                error={errors.phoneNumber?.message}
                required
                {...register('phoneNumber')}
              />
              <InputField
                label="Telephone number"
                type="tel"
                error={errors.telephoneNumber?.message}
                {...register('telephoneNumber')}
              />
              <InputField
                label="Tax registration number"
                error={errors.taxRegistrationNumber?.message}
                {...register('taxRegistrationNumber')}
              />
              <SelectField label="Status" error={errors.status?.message} required {...register('status')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SelectField>
              <div className="form-grid__full">
                <TextareaField
                  label="Description"
                  rows={3}
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>
            </div>
          </Card>

          <Card title="Bank details" description="Store payment details as reference data only.">
            <div className="form-grid form-grid--two">
              <InputField label="Bank name" error={errors.bankName?.message} {...register('bankName')} />
              <InputField
                label="Account number"
                inputMode="numeric"
                error={errors.bankAccountNumber?.message}
                {...register('bankAccountNumber')}
              />
            </div>
            <div className="form-actions">
              <Button type="submit" icon={<Save size={17} />} disabled={isEditing && !isDirty}>
                {isEditing ? 'Save changes' : 'Save supplier'}
              </Button>
              <Button
                variant="secondary"
                icon={<XCircle size={17} />}
                onClick={() => void navigate('/warehouse/suppliers')}
              >
                Cancel
              </Button>
              {!isEditing ? <Button variant="ghost" onClick={() => reset(defaultValues)}>Clear</Button> : null}
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
