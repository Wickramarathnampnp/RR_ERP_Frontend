import { Bell, Menu, UserRound } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="topbar">
      <button className="topbar__menu icon-button" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu size={22} aria-hidden="true" />
      </button>
      <div className="topbar__title">
        <span>RR Construction</span>
        <strong>Warehouse & Purchasing</strong>
      </div>
      <div className="topbar__actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} aria-hidden="true" />
          <span className="notification-dot" aria-hidden="true" />
        </button>
        <div className="user-menu" aria-label="Signed in user">
          <div className="user-menu__avatar"><UserRound size={18} aria-hidden="true" /></div>
          <div className="user-menu__details">
            <strong>Store Manager</strong>
            <span>RR Construction</span>
          </div>
        </div>
      </div>
    </header>
  );
}
