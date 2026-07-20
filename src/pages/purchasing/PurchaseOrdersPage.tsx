import { Eye, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Dialog } from '../../components/ui/Dialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { useAppData } from '../../hooks/useAppData';
import type { PurchaseOrder, PurchaseOrderItem } from '../../types/domain';
import { formatCurrency, formatDate } from '../../utils/format';

export function PurchaseOrdersPage() {
  const { state } = useAppData();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.purchaseOrders;
    return state.purchaseOrders.filter((order) =>
      [order.purchaseOrderNumber, order.supplierName, order.deliverProject]
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query, state.purchaseOrders]);

  const columns: Column<PurchaseOrder>[] = [
    { key: 'number', header: 'PO number', cell: (order) => <strong>{order.purchaseOrderNumber}</strong> },
    { key: 'ordered', header: 'Ordered date', cell: (order) => formatDate(order.orderedDate) },
    { key: 'supplier', header: 'Supplier', cell: (order) => order.supplierName },
    { key: 'project', header: 'Deliver project', cell: (order) => order.deliverProject },
    { key: 'due', header: 'Due date', cell: (order) => formatDate(order.orderDueDate) },
    { key: 'items', header: 'Items', align: 'right', cell: (order) => order.items.length },
    { key: 'total', header: 'Total amount', align: 'right', cell: (order) => <strong>{formatCurrency(order.totalAmount)}</strong> },
    {
      key: 'view', header: 'Action', align: 'right', cell: (order) => (
        <div className="row-actions">
          <button className="table-action" onClick={() => setSelected(order)}><Eye size={16} /> View</button>
          <Link className="table-action" to={`/purchasing/orders/${order.purchaseOrderNumber}`}>Open</Link>
        </div>
      ),
    },
  ];

  const itemColumns: Column<PurchaseOrderItem>[] = [
    { key: 'code', header: 'Stock code', cell: (item) => item.stockCode },
    { key: 'description', header: 'Description', cell: (item) => item.description },
    { key: 'quantity', header: 'Quantity', align: 'right', cell: (item) => `${item.quantity} ${item.uom}` },
    { key: 'price', header: 'Unit price', align: 'right', cell: (item) => formatCurrency(item.unitPrice) },
    { key: 'amount', header: 'Amount', align: 'right', cell: (item) => formatCurrency(item.amount) },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Purchasing Department"
        title="Purchase orders"
        description="Review purchase order initial details, supplier information, items, and totals."
        actions={<Link to="/purchasing/orders/new"><Button icon={<Plus size={17} />}>Create purchase order</Button></Link>}
      />
      <Card>
        <div className="toolbar">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search PO number, supplier, or project"
            aria-label="Search purchase orders"
          />
          <span className="result-count">{rows.length} result(s)</span>
        </div>
        {rows.length ? (
          <DataTable columns={columns} rows={rows} getRowKey={(order) => order.purchaseOrderNumber} caption="Purchase orders" />
        ) : (
          <EmptyState
            title="No purchase orders found"
            description="Create the first purchase order or change the search term."
            action={<Link to="/purchasing/orders/new"><Button>Create purchase order</Button></Link>}
          />
        )}
      </Card>

      <Dialog open={Boolean(selected)} title={selected?.purchaseOrderNumber ?? 'Purchase order'} onClose={() => setSelected(null)} footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}>
        {selected ? (
          <div className="page-stack page-stack--compact">
            <dl className="detail-grid">
              <div><dt>Ordered date</dt><dd>{formatDate(selected.orderedDate)}</dd></div>
              <div><dt>Due date</dt><dd>{formatDate(selected.orderDueDate)}</dd></div>
              <div><dt>Freight type</dt><dd>{selected.freightType}</dd></div>
              <div><dt>Payment term</dt><dd>{selected.paymentTerm}</dd></div>
              <div><dt>Supplier</dt><dd>{selected.supplierName}</dd></div>
              <div><dt>Supplier code</dt><dd>{selected.supplierCode}</dd></div>
              <div className="detail-grid__full"><dt>Supplier address</dt><dd>{selected.supplierAddress}</dd></div>
              <div><dt>Deliver project</dt><dd>{selected.deliverProject}</dd></div>
              <div><dt>Deliver location</dt><dd>{selected.deliverLocation}</dd></div>
              <div className="detail-grid__full"><dt>End-user project details</dt><dd>{selected.endUserProjectDetails}</dd></div>
            </dl>
            <DataTable columns={itemColumns} rows={selected.items} getRowKey={(item) => item.id} caption={`Items for ${selected.purchaseOrderNumber}`} />
            <div className="po-total"><span>Total amount</span><strong>{formatCurrency(selected.totalAmount)}</strong></div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
