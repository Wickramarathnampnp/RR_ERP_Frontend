import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { NotificationContext } from './notification-context';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 3500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {message ? (
          <div className="toast" role="status">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{message}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss notification">
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </NotificationContext.Provider>
  );
}
