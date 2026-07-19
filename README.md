# RR Construction – Warehouse & Purchasing Frontend

A responsive React + TypeScript frontend implementing the Phase 1 / Sub Phase 1A functional requirements for the Main Store and Purchasing Department.

## Included modules

- Dashboard overview
- Add, list, view, and edit stock entries
- Add, list, view, and edit suppliers
- Receive stock and update available quantity
- Stock inquiry with last-received information
- Create purchase orders with:
  - Initial order details
  - Supplier auto-fill
  - Purchase-order items
  - Automatic item amounts and order total
- Purchase-order list and detail view
- Responsive sidebar and header
- Form validation, accessible labels, empty states, and notifications
- LocalStorage persistence for a working frontend-only demo

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Backend integration

The current demo stores data in `localStorage` through `src/services/storage.ts`. Replace that adapter with API calls while keeping the page and form components unchanged. Recommended next steps:

1. Add an API client with environment-based base URLs.
2. Replace the context reducer with server-state queries and mutations.
3. Add authentication and role-based route protection.
4. Move stock-code, supplier-code, and purchase-order uniqueness checks to the server.
5. Add pagination, audit logs, and export functionality when the dataset grows.
