import type { ReactNode } from 'react';

type BadgeTone = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
