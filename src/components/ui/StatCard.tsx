import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone?: 'default' | 'warning' | 'success';
}

export function StatCard({ label, value, detail, icon, tone = 'default' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon" aria-hidden="true">{icon}</div>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__detail">{detail}</p>
      </div>
    </article>
  );
}
