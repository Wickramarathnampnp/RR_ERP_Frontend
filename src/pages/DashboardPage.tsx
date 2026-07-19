import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  PackageCheck,
  RotateCcw,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { useNotification } from '../hooks/useNotification';
import { useAppData } from '../hooks/useAppData';
import { getFreshSeedData } from '../services/storage';
import { formatCurrency, formatDate } from '../utils/format';

export function DashboardPage() {
  const { state, dispatch } = useAppData();
  const { notify } = useNotification();
  const lowStockItems = state.stocks.filter((stock) => stock.availableQuantity <= 50);
  const activeSuppliers = state.suppliers.filter((supplier) => supplier.status === 'Active');
  const inventoryValue = state.stocks.reduce(
    (sum, stock) => sum + stock.availableQuantity * stock.unitPrice,
    0,
  );

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Phase 1 · Sub Phase 1A"
        title="Operations overview"
        description="Monitor warehouse inventory, suppliers, stock receipts, and purchase orders from one place."
        actions={
          <Button
            variant="secondary"
            icon={<RotateCcw size={17} />}
            onClick={() => {
              dispatch({ type: 'RESET_DEMO_DATA', payload: getFreshSeedData() });
              notify('Demo data has been restored.');
            }}
          >
            Reset demo data
          </Button>
        }
      />

      <section className="stats-grid" aria-label="Warehouse summary">
        <StatCard
          label="Stock items"
          value={state.stocks.length}
          detail={`${state.stocks.filter((stock) => stock.status === 'Active').length} active items`}
          icon={<Boxes size={24} />}
        />
        <StatCard
          label="Low stock"
          value={lowStockItems.length}
          detail="Items with 50 units or fewer"
          icon={<AlertTriangle size={24} />}
          tone={lowStockItems.length > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Active suppliers"
          value={activeSuppliers.length}
          detail={`${state.suppliers.length} registered suppliers`}
          icon={<UsersRound size={24} />}
        />
        <StatCard
          label="Inventory value"
          value={formatCurrency(inventoryValue)}
          detail="Based on available quantity"
          icon={<PackageCheck size={24} />}
          tone="success"
        />
      </section>

      <div className="dashboard-grid">
        <Card
          title="Low-stock attention"
          description="Items that may require replenishment soon."
          actions={<Link className="text-link" to="/warehouse/inquiry">View inquiry</Link>}
        >
          {lowStockItems.length ? (
            <div className="activity-list">
              {lowStockItems.slice(0, 5).map((stock) => (
                <div className="activity-row" key={stock.stockCode}>
                  <div className="activity-row__icon"><AlertTriangle size={18} /></div>
                  <div className="activity-row__content">
                    <strong>{stock.stockCode} · {stock.description}</strong>
                    <span>{stock.category} · {stock.uom}</span>
                  </div>
                  <div className="activity-row__value">
                    <strong>{stock.availableQuantity}</strong>
                    <span>available</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No low-stock items at present.</p>
          )}
        </Card>

        <Card
          title="Recent purchase orders"
          description="Latest orders created by the purchasing department."
          actions={<Link className="text-link" to="/purchasing/orders">View all</Link>}
        >
          {state.purchaseOrders.length ? (
            <div className="activity-list">
              {state.purchaseOrders.slice(0, 5).map((order) => (
                <div className="activity-row" key={order.purchaseOrderNumber}>
                  <div className="activity-row__icon"><ClipboardList size={18} /></div>
                  <div className="activity-row__content">
                    <strong>{order.purchaseOrderNumber}</strong>
                    <span>{order.supplierName} · Due {formatDate(order.orderDueDate)}</span>
                  </div>
                  <div className="activity-row__value">
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                    <span>{order.items.length} item(s)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No purchase orders have been created.</p>
          )}
        </Card>
      </div>

      <Card title="Quick actions" description="Common warehouse and purchasing tasks.">
        <div className="quick-actions">
          <Link className="quick-action" to="/warehouse/stocks/new">
            <Boxes size={21} />
            <span><strong>Add stock entry</strong><small>Register a new warehouse item</small></span>
          </Link>
          <Link className="quick-action" to="/warehouse/quantity/update">
            <PackageCheck size={21} />
            <span><strong>Receive stock</strong><small>Update an item’s available quantity</small></span>
          </Link>
          <Link className="quick-action" to="/warehouse/suppliers/new">
            <UsersRound size={21} />
            <span><strong>Add supplier</strong><small>Register supplier and bank details</small></span>
          </Link>
          <Link className="quick-action" to="/purchasing/orders/new">
            <ClipboardList size={21} />
            <span><strong>Create purchase order</strong><small>Add order, supplier, and item details</small></span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
