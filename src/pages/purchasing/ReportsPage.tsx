import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';

export function PurchasingReportsPage() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Purchasing · Reports" title="Reports" description="Quick access to purchasing reports and summaries." />

      <div className="dashboard-grid">
        <Card title="Material requests" description="Review material requests and their statuses." actions={<Link to="/purchasing/material-requests"><Button>Open</Button></Link>} />
        <Card title="Purchase orders" description="List of purchase orders and statuses." actions={<Link to="/purchasing/orders"><Button>Open</Button></Link>} />
        <Card title="Suppliers" description="Supplier register and contact details." actions={<Link to="/purchasing/suppliers"><Button>Open</Button></Link>} />
        <Card title="Stock" description="Stock reference for purchasing decisions." actions={<Link to="/purchasing/stocks"><Button>Open</Button></Link>} />
      </div>
    </div>
  );
}
