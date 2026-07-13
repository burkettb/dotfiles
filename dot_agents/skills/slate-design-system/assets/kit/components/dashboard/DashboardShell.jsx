import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * AppShell — the dashboard frame: a collapsible left sidebar + a main column
 * (top bar + scrolling content). Structure comes from hairline borders, not
 * shadows. Collapse is controlled internally unless you pass `collapsed`.
 */
export function DashboardShell({ logo, nav = [], sidebarFooter, topBar, collapsed: collapsedProp, defaultCollapsed = false, onNavigate, children, className = '', ...rest }) {
  const [internal, setInternal] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp != null ? collapsedProp : internal;
  const toggle = () => setInternal((c) => !c);

  return (
    <div className={`sds-shell ${collapsed ? 'sds-shell--collapsed' : ''} ${className}`} {...rest}>
      <aside className="sds-shell__sidebar">
        <div className="sds-shell__brand">
          <span className="sds-shell__logo">{logo}</span>
          <button type="button" className="sds-shell__collapse" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggle}>
            <Icon name="chevron-right" size={16} className="sds-shell__collapse-icon" />
          </button>
        </div>
        <nav className="sds-shell__nav">
          {nav.map((item, i) =>
            item.section ? (
              <div className="sds-shell__nav-section" key={`s${i}`}>{item.section}</div>
            ) : (
              <a
                key={item.key || item.label}
                href={item.href || '#'}
                className={`sds-nav-item ${item.active ? 'sds-nav-item--active' : ''}`}
                aria-current={item.active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(item); } }}
              >
                {item.icon && <Icon name={item.icon} size={18} />}
                <span className="sds-shell__nav-label">{item.label}</span>
                {item.badge != null && <span className="sds-shell__nav-badge">{item.badge}</span>}
              </a>
            )
          )}
        </nav>
        {sidebarFooter && <div className="sds-shell__sidebar-footer">{sidebarFooter}</div>}
      </aside>
      <div className="sds-shell__main">
        {topBar}
        <main className="sds-shell__content">{children}</main>
      </div>
    </div>
  );
}

/** TopBar — sits above the content. Left: breadcrumbs. Right: search + actions + user. */
export function TopBar({ breadcrumbs, search, actions, user, className = '', ...rest }) {
  return (
    <header className={`sds-topbar ${className}`} {...rest}>
      <div className="sds-topbar__left">{breadcrumbs}</div>
      <div className="sds-topbar__right">
        {search}
        {actions}
        {user}
      </div>
    </header>
  );
}

/** Breadcrumbs moved to components/navigation/Breadcrumbs.jsx (shared primitive). */

/** SearchField — the top-bar search box with a leading glyph. */
export function SearchField({ placeholder = 'Search…', width = 240, className = '', ...rest }) {
  return (
    <div className={`sds-search ${className}`} style={{ width }}>
      <Icon name="magnifying-glass" size={16} className="sds-search__icon" />
      <input className="sds-search__input" type="search" placeholder={placeholder} {...rest} />
    </div>
  );
}

/** UserMenu — avatar + name button that opens a small popover menu. */
export function UserMenu({ name = '', email, avatar, items = [], onSelect, className = '' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  return (
    <div className={`sds-usermenu ${className}`} ref={ref}>
      <button type="button" className="sds-usermenu__trigger" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {avatar}
        <span className="sds-usermenu__name">{name}</span>
        <Icon name="chevron-right" size={14} className="sds-usermenu__caret" />
      </button>
      {open && (
        <div className="sds-menu sds-usermenu__pop" role="menu">
          {(name || email) && (
            <div className="sds-menu__header">
              {name && <div className="sds-menu__name">{name}</div>}
              {email && <div className="sds-menu__email">{email}</div>}
            </div>
          )}
          {items.map((it) => (
            it.divider ? <div className="sds-menu__divider" key={Math.random()} /> :
            <button key={it.label} type="button" role="menuitem" className={`sds-menu__item ${it.danger ? 'sds-menu__item--danger' : ''}`} onClick={() => { setOpen(false); onSelect && onSelect(it); }}>
              {it.icon && <Icon name={it.icon} size={16} />}{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
