import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <NotificationProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </NotificationProvider>
  </StrictMode>,
);
