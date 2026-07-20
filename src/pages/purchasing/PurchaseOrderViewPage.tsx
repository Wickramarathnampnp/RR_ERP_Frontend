import { Printer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAppData } from '../../hooks/useAppData';
import { formatCurrency, formatDate } from '../../utils/format';

export function PurchaseOrderViewPage() {
  const { poNumber } = useParams();
  const navigate = useNavigate();
  const { state } = useAppData();

  const order = state.purchaseOrders.find((o) => o.purchaseOrderNumber === poNumber);

  if (!order) {
    return (
      <div className="page-stack">
        <PageHeader title="Purchase order not found" description="The requested purchase order was not found." />
        <Button variant="secondary" onClick={() => navigate('/purchasing/orders')}>Back to orders</Button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Purchasing · Purchase order" title={`PO ${order.purchaseOrderNumber}`} description={`Ordered ${formatDate(order.orderedDate)}`} />

      <Card>
        <div className="po-printable">
          <h3>Supplier</h3>
          <p>{order.supplierName}</p>
          <p>{order.supplierAddress}</p>

          <h3>Order details</h3>
          <p>Project: {order.deliverProject}</p>
          <p>Delivery: {order.deliverLocation}</p>
          <p>Payment term: {order.paymentTerm}</p>

          <h3>Items</h3>
          <table className="table">
            <thead>
              <tr><th>Code</th><th>Description</th><th>UOM</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td>{it.stockCode}</td>
                  <td>{it.description}</td>
                  <td>{it.uom}</td>
                  <td style={{ textAlign: 'right' }}>{it.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(it.unitPrice)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(it.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="po-total" style={{ marginTop: 16 }}>
            <strong>Total: {formatCurrency(order.totalAmount)}</strong>
          </div>
        </div>
      </Card>

      <div className="form-actions">
        <Button icon={<Printer size={16} />} onClick={() => window.print()}>Print</Button>
        <Button variant="secondary" onClick={() => navigate('/purchasing/orders')}>Back</Button>
      </div>
    </div>
  );
}
