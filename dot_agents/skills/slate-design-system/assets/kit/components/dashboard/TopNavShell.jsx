import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * TopNavShell — the preferred app frame for products with ≤6 top-level
 * destinations: logo + horizontal nav in a hairline top bar, content below in
 * a centered container. Reach for DashboardShell (sidebar) only when sections
 * multiply or need grouping/nesting.
 */
export function TopNavShell({ logo, nav = [], actions, user, onNavigate, wide = false, children, className = '', ...rest }) {
  return (
    <div className={`sds-topnav-shell ${className}`} {...rest}>
      <header className="sds-topnav">
        <div className={`sds-topnav__inner ${wide ? 'sds-topnav__inner--wide' : ''}`}>
          <span className="sds-topnav__logo">{logo}</span>
          <nav className="sds-topnav__nav" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.key || item.label}
                href={item.href || '#'}
                className={`sds-topnav__item ${item.active ? 'sds-topnav__item--active' : ''}`}
                aria-current={item.active ? 'page' : undefined}
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(item); } }}
              >
                {item.icon && <Icon name={item.icon} size={16} />}
                {item.label}
                {item.badge != null && <span className="sds-topnav__badge">{item.badge}</span>}
              </a>
            ))}
          </nav>
          <div className="sds-topnav__right">
            {actions}
            {user}
          </div>
        </div>
      </header>
      <main className={`sds-topnav-shell__content ${wide ? 'sds-topnav-shell__content--wide' : ''}`}>{children}</main>
    </div>
  );
}
