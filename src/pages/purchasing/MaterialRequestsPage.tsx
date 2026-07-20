import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';

export interface MaterialRequest {
  id: string;
  project: string;
  requestedBy: string;
  summary: string;
  status: 'Open' | 'Approved' | 'Closed';
  createdAt: string;
}

const STORAGE_KEY = 'purchasing_material_requests';

function loadRequests(): MaterialRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as MaterialRequest[] : [];
  } catch {
    return [];
  }
}

// persistence helper: saved by MR form component

export function MaterialRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaterialRequest[]>([]);

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  const columns: Column<MaterialRequest>[] = [
    { key: 'id', header: 'MR ID', cell: (r) => <strong>{r.id}</strong> },
    { key: 'project', header: 'Project', cell: (r) => r.project },
    { key: 'requestedBy', header: 'Requested by', cell: (r) => r.requestedBy },
    { key: 'summary', header: 'Summary', cell: (r) => r.summary },
    { key: 'status', header: 'Status', cell: (r) => r.status },
    { key: 'createdAt', header: 'Created', cell: (r) => r.createdAt },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Purchasing · Material Requests"
        title="Material requests"
        description="Requests raised by project teams for procurement consideration."
        actions={<Button icon={<Plus size={16} />} onClick={() => navigate('/purchasing/material-requests/new')}>Create MR</Button>}
      />

      <Card>
        {requests.length ? (
          <DataTable columns={columns} rows={requests} getRowKey={(r) => r.id} caption="Material requests" />
        ) : (
          <EmptyState title="No material requests" description="Create the first material request." action={<Button onClick={() => navigate('/purchasing/material-requests/new')}>Create MR</Button>} />
        )}
      </Card>
    </div>
  );
}
