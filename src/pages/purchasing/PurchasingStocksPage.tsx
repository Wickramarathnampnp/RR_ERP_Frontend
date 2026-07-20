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
import type { StockItem } from '../../types/domain';
import { formatCurrency, formatDate } from '../../utils/format';

export function PurchasingStocksPage() {
  const { state } = useAppData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState<StockItem | null>(null);

  const filteredStocks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return state.stocks.filter((stock) => {
      const matchesQuery = !normalized || [
        stock.stockCode,
        stock.stockType,
        stock.category,
        stock.description,
      ].some((value) => value.toLowerCase().includes(normalized));
      const matchesStatus = status === 'All' || stock.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, state.stocks, status]);

  const columns: Column<StockItem>[] = [
    { key: 'code', header: 'Stock code', cell: (stock) => <strong>{stock.stockCode}</strong> },
    { key: 'type', header: 'Stock type', cell: (stock) => stock.stockType },
    { key: 'category', header: 'Category', cell: (stock) => stock.category },
    { key: 'uom', header: 'UOM', cell: (stock) => stock.uom },
    { key: 'price', header: 'Unit price', align: 'right', cell: (stock) => formatCurrency(stock.unitPrice) },
    { key: 'available', header: 'Available quantity', align: 'right', cell: (stock) => (
      <span className={stock.availableQuantity <= 50 ? 'quantity-low' : ''}>{stock.availableQuantity}</span>
    ) },
    { key: 'lastQty', header: 'Last received qty.', align: 'right', cell: (stock) => stock.lastReceivedQuantity || '—' },
    { key: 'lastDate', header: 'Last received date', cell: (stock) => formatDate(stock.lastReceivedDate) },
    { key: 'level', header: 'Stock level', cell: (stock) => (
      <Badge tone={stock.availableQuantity === 0 ? 'danger' : stock.availableQuantity <= 50 ? 'warning' : 'success'}>
        {stock.availableQuantity === 0 ? 'Out of stock' : stock.availableQuantity <= 50 ? 'Low' : 'Available'}
      </Badge>
    ) },
    { key: 'actions', header: 'Actions', align: 'right', cell: (stock) => (
      <div className="row-actions">
        <button className="table-action" onClick={() => setSelected(stock)} aria-label={`View ${stock.stockCode}`}><Eye size={16} /> View</button>
        <button className="table-action" onClick={() => void navigate(`/purchasing/stocks/${stock.stockCode}/edit`)} aria-label={`Edit ${stock.stockCode}`}><Pencil size={16} /> Edit</button>
      </div>
    ) },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Purchasing · Stock Reference"
        title="Stock register"
        description="Reference stock master records for purchasing decisions and inquiry."
        actions={<Link to="/purchasing/stocks/new"><Button icon={<Plus size={17} />}>Add stock</Button></Link>}
      />

      <Card>
        <div className="toolbar">
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="Search stock inquiry" aria-label="Search stock inquiry" />
          <label className="compact-field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        {filteredStocks.length ? (
          <DataTable columns={columns} rows={filteredStocks} getRowKey={(stock) => stock.stockCode} caption="Registered stock items" />
        ) : (
          <EmptyState title="No stock items found" description="Change the search filters or create a new stock entry." action={<Link to="/purchasing/stocks/new"><Button>Add stock entry</Button></Link>} />
        )}
      </Card>

      <Dialog open={Boolean(selected)} title={selected ? `${selected.stockCode} details` : 'Stock details'} onClose={() => setSelected(null)} footer={selected ? (
        <>
          <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          <Button onClick={() => void navigate(`/purchasing/stocks/${selected.stockCode}/edit`)}>Edit stock</Button>
        </>
      ) : null}>
        {selected ? (
          <dl className="detail-grid">
            <div><dt>Stock type</dt><dd>{selected.stockType}</dd></div>
            <div><dt>Category</dt><dd>{selected.category}</dd></div>
            <div><dt>UOM</dt><dd>{selected.uom}</dd></div>
            <div><dt>Unit price</dt><dd>{formatCurrency(selected.unitPrice)}</dd></div>
            <div><dt>Available quantity</dt><dd>{selected.availableQuantity}</dd></div>
            <div><dt>Last received quantity</dt><dd>{selected.lastReceivedQuantity}</dd></div>
            <div><dt>Last received date</dt><dd>{formatDate(selected.lastReceivedDate)}</dd></div>
            <div><dt>Status</dt><dd><Badge tone={selected.status === 'Active' ? 'success' : 'neutral'}>{selected.status}</Badge></dd></div>
            <div className="detail-grid__full"><dt>Description</dt><dd>{selected.description}</dd></div>
          </dl>
        ) : null}
      </Dialog>
    </div>
  );
}
