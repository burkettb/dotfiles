import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Breadcrumbs — trail of links; last item is the current page. */
export function Breadcrumbs({ items = [], onNavigate, className = '', ...rest }) {
  return (
    <nav className={`sds-crumbs ${className}`} aria-label="Breadcrumb" {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={it.label}>
            {last ? (
              <span className="sds-crumbs__current" aria-current="page">{it.label}</span>
            ) : (
              <a className="sds-crumbs__link" href={it.href || '#'} onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(it); } }}>{it.label}</a>
            )}
            {!last && <Icon name="chevron-right" size={14} className="sds-crumbs__sep" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
