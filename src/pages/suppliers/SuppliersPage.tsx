import { Eye, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { useAppData } from '../../hooks/useAppData';
import type { Supplier } from '../../types/domain';
import { joinAddress } from '../../utils/format';

export function SuppliersPage() {
  const { state } = useAppData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.suppliers;
    return state.suppliers.filter((supplier) =>
      [
        supplier.supplierCode,
        supplier.supplierName,
        supplier.city,
        supplier.emailAddress,
        supplier.phoneNumber,
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query, state.suppliers]);

  const columns: Column<Supplier>[] = [
    { key: 'code', header: 'Supplier code', cell: (supplier) => <strong>{supplier.supplierCode}</strong> },
    { key: 'name', header: 'Supplier name', cell: (supplier) => supplier.supplierName },
    {
      key: 'address',
      header: 'Address',
      cell: (supplier) => joinAddress([supplier.addressLine1, supplier.addressLine2, supplier.city]),
    },
    { key: 'email', header: 'Email address', cell: (supplier) => <a className="text-link" href={`mailto:${supplier.emailAddress}`}>{supplier.emailAddress}</a> },
    { key: 'phone', header: 'Phone number', cell: (supplier) => supplier.phoneNumber },
    {
      key: 'status',
      header: 'Status',
      cell: (supplier) => <Badge tone={supplier.status === 'Active' ? 'success' : 'neutral'}>{supplier.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (supplier) => (
        <div className="row-actions">
          <button className="table-action" onClick={() => setSelected(supplier)}><Eye size={16} /> View</button>
          <button className="table-action" onClick={() => void navigate(`/warehouse/suppliers/${supplier.supplierCode}/edit`)}><Pencil size={16} /> Edit</button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Warehouse · Supplier Management"
        title="Supplier register"
        description="Review supplier contact details, tax information, bank references, and status."
        actions={<Link to="/warehouse/suppliers/new"><Button icon={<Plus size={17} />}>Add supplier</Button></Link>}
      />
      <Card>
        <div className="toolbar">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search code, name, city, email, or phone"
            aria-label="Search suppliers"
          />
          <span className="result-count">{rows.length} result(s)</span>
        </div>
        {rows.length ? (
          <DataTable columns={columns} rows={rows} getRowKey={(supplier) => supplier.supplierCode} caption="Registered suppliers" />
        ) : (
          <EmptyState
            title="No suppliers found"
            description="Change the search term or register a new supplier."
            action={<Link to="/warehouse/suppliers/new"><Button>Add supplier</Button></Link>}
          />
        )}
      </Card>

      <Dialog
        open={Boolean(selected)}
        title={selected?.supplierName ?? 'Supplier details'}
        onClose={() => setSelected(null)}
        footer={selected ? (
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={() => void navigate(`/warehouse/suppliers/${selected.supplierCode}/edit`)}>Edit supplier</Button>
          </>
        ) : null}
      >
        {selected ? (
          <dl className="detail-grid">
            <div><dt>Supplier code</dt><dd>{selected.supplierCode}</dd></div>
            <div><dt>Status</dt><dd><Badge tone={selected.status === 'Active' ? 'success' : 'neutral'}>{selected.status}</Badge></dd></div>
            <div className="detail-grid__full"><dt>Address</dt><dd>{joinAddress([selected.addressLine1, selected.addressLine2, selected.city])}</dd></div>
            <div><dt>Email</dt><dd>{selected.emailAddress}</dd></div>
            <div><dt>Phone</dt><dd>{selected.phoneNumber}</dd></div>
            <div><dt>Telephone</dt><dd>{selected.telephoneNumber || '—'}</dd></div>
            <div><dt>Tax registration</dt><dd>{selected.taxRegistrationNumber || '—'}</dd></div>
            <div><dt>Bank name</dt><dd>{selected.bankName || '—'}</dd></div>
            <div><dt>Account number</dt><dd>{selected.bankAccountNumber || '—'}</dd></div>
            <div className="detail-grid__full"><dt>Description</dt><dd>{selected.description || '—'}</dd></div>
          </dl>
        ) : null}
      </Dialog>
    </div>
  );
}
