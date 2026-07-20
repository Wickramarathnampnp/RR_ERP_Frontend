import {
  Boxes,
  ChevronDown,
  ClipboardList,
  PackagePlus,
  Search,
  Store,
  Truck,
  UsersRound,
  Warehouse,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: typeof Store;
}

interface NavGroup {
  label: string;
  icon: typeof Store;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Warehouse',
    icon: Warehouse,
    items: [
      { label: 'Add stock entry', to: '/warehouse/stocks/new', icon: PackagePlus },
      { label: 'Show stock', to: '/warehouse/stocks', icon: Boxes },
      
      { label: 'Show suppliers', to: '/warehouse/suppliers', icon: UsersRound },
      { label: 'Update quantity', to: '/warehouse/quantity/update', icon: Truck },
      { label: 'Stock inquiry', to: '/warehouse/inquiry', icon: Search },
    ],
  },
  {
    label: 'Purchasing Department',
    icon: ClipboardList,
    items: [
      { label: 'Purchase orders', to: '/purchasing/orders', icon: ClipboardList },
      { label: 'Create purchase order', to: '/purchasing/orders/new', icon: PackagePlus },
        { label: 'Suppliers', to: '/purchasing/suppliers', icon: UsersRound },
        { label: 'Stock', to: '/purchasing/stocks', icon: Boxes },
        { label: 'Material requests', to: '/purchasing/material-requests', icon: ClipboardList },
        { label: 'Reports', to: '/purchasing/reports', icon: ClipboardList },
    ],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Warehouse: true,
    'Purchasing Department': true,
  });

  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop${open ? ' sidebar-backdrop--visible' : ''}`}
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__brand">
          <div className="brand-mark" aria-hidden="true">RR</div>
          <div>
            <strong>RR Construction</strong>
            <span>Operations ERP</span>
          </div>
          <button className="sidebar__close icon-button" onClick={onClose} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            <Store size={18} aria-hidden="true" />
            <span>Overview</span>
          </NavLink>

          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expanded[group.label] ?? true;
            return (
              <section className="nav-group" key={group.label}>
                <button
                  type="button"
                  className="nav-group__toggle"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpanded((current) => ({
                      ...current,
                      [group.label]: !isExpanded,
                    }))
                  }
                >
                  <GroupIcon size={18} aria-hidden="true" />
                  <span>{group.label}</span>
                  <ChevronDown
                    size={16}
                    className={isExpanded ? 'nav-group__chevron nav-group__chevron--open' : 'nav-group__chevron'}
                    aria-hidden="true"
                  />
                </button>
                {isExpanded ? (
                  <div className="nav-group__items">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `nav-link nav-link--nested${isActive ? ' nav-link--active' : ''}`
                          }
                        >
                          <Icon size={17} aria-hidden="true" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <span>Phase 1 · Sub Phase 1A</span>
          <strong>Main Store & Purchasing</strong>
        </div>
      </aside>
    </>
  );
}
