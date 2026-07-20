export function formatCurrency(value: number, currency = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function joinAddress(parts: Array<string | undefined>): string {
  return parts.map((part) => part?.trim()).filter(Boolean).join(', ');
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
