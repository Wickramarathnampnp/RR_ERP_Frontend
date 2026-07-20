import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputField, TextareaField } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useState } from 'react';

const STORAGE_KEY = 'purchasing_material_requests';

function loadRequests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveRequests(items: any[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function makeId() { return `MR-${Date.now().toString().slice(-6)}`; }

export function MaterialRequestFormPage() {
  const navigate = useNavigate();
  const [project, setProject] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [summary, setSummary] = useState('');

  const submit = () => {
    if (!project || !requestedBy || !summary) return;
    const items = loadRequests();
    const mr = { id: makeId(), project, requestedBy, summary, status: 'Open', createdAt: new Date().toISOString().slice(0,10) };
    items.unshift(mr);
    saveRequests(items);
    navigate('/purchasing/material-requests');
  };

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Purchasing · Material Request" title="Create material request" description="Raise a request for procurement to review." />

      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="page-stack">
          <Card title="Request details">
            <div className="form-grid form-grid--two">
              <InputField label="Project" value={project} onChange={(e) => setProject(e.target.value)} required />
              <InputField label="Requested by" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} required />
              <div className="form-grid__full">
                <TextareaField label="Summary" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} required />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit">Save MR</Button>
              <Button variant="secondary" onClick={() => navigate('/purchasing/material-requests')}>Cancel</Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
