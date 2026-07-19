import { useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { useAppData } from '../../hooks/useAppData';
import type { StockItem } from '../../types/domain';
import { formatCurrency, formatDate } from '../../utils/format';

export function StockInquiryPage() {
  const { state } = useAppData();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.stocks;
    return state.stocks.filter((stock) =>
      [stock.stockCode, stock.stockType, stock.category, stock.description]
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query, state.stocks]);

  const columns: Column<StockItem>[] = [
    { key: 'code', header: 'Stock code', cell: (stock) => <strong>{stock.stockCode}</strong> },
    { key: 'type', header: 'Stock type', cell: (stock) => stock.stockType },
    { key: 'category', header: 'Category', cell: (stock) => stock.category },
    { key: 'uom', header: 'UOM', cell: (stock) => stock.uom },
    { key: 'price', header: 'Unit price', align: 'right', cell: (stock) => formatCurrency(stock.unitPrice) },
    {
      key: 'available', header: 'Available quantity', align: 'right', cell: (stock) => (
        <span className={stock.availableQuantity <= 50 ? 'quantity-low' : ''}>{stock.availableQuantity}</span>
      ),
    },
    { key: 'lastQty', header: 'Last received qty.', align: 'right', cell: (stock) => stock.lastReceivedQuantity || '—' },
    { key: 'lastDate', header: 'Last received date', cell: (stock) => formatDate(stock.lastReceivedDate) },
    {
      key: 'level', header: 'Stock level', cell: (stock) => (
        <Badge tone={stock.availableQuantity === 0 ? 'danger' : stock.availableQuantity <= 50 ? 'warning' : 'success'}>
          {stock.availableQuantity === 0 ? 'Out of stock' : stock.availableQuantity <= 50 ? 'Low' : 'Available'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Warehouse · Quantity Management"
        title="Stock inquiry"
        description="Review current quantities and the most recent receipt information for every item."
      />
      <Card>
        <div className="toolbar">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search stock inquiry"
            aria-label="Search stock inquiry"
          />
          <span className="result-count">{rows.length} result(s)</span>
        </div>
        {rows.length ? (
          <DataTable columns={columns} rows={rows} getRowKey={(stock) => stock.stockCode} caption="Stock inquiry results" />
        ) : (
          <EmptyState title="No matching stock" description="Try a different stock code, type, category, or description." />
        )}
      </Card>
    </div>
  );
}
