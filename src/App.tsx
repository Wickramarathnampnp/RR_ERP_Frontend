import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PurchaseOrderFormPage } from './pages/purchasing/PurchaseOrderFormPage';
import { PurchaseOrdersPage } from './pages/purchasing/PurchaseOrdersPage';
import { StockFormPage } from './pages/stocks/StockFormPage';
import { StockInquiryPage } from './pages/stocks/StockInquiryPage';
import { StocksPage } from './pages/stocks/StocksPage';
import { UpdateQuantityPage } from './pages/stocks/UpdateQuantityPage';
import { SupplierFormPage } from './pages/suppliers/SupplierFormPage';
import { SuppliersPage } from './pages/suppliers/SuppliersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'warehouse/stocks', element: <StocksPage /> },
      { path: 'warehouse/stocks/new', element: <StockFormPage /> },
      { path: 'warehouse/stocks/:stockCode/edit', element: <StockFormPage /> },
      { path: 'warehouse/suppliers', element: <SuppliersPage /> },
      { path: 'warehouse/suppliers/new', element: <SupplierFormPage /> },
      {
        path: 'warehouse/suppliers/:supplierCode/edit',
        element: <SupplierFormPage />,
      },
      { path: 'warehouse/quantity/update', element: <UpdateQuantityPage /> },
      { path: 'warehouse/inquiry', element: <StockInquiryPage /> },
      { path: 'purchasing/orders', element: <PurchaseOrdersPage /> },
      { path: 'purchasing/orders/new', element: <PurchaseOrderFormPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
