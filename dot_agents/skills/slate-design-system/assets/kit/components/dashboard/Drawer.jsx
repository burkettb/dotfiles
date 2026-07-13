import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Drawer — a slide-over detail panel anchored to the right (or left) edge.
 * Scrim + soft shadow (it genuinely floats). Header (title + close), scrolling
 * body, optional sticky footer. Close on scrim click or Escape.
 */
export function Drawer({ open, onClose, title, description, side = 'right', width = 420, footer, children, className = '', ...rest }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sds-drawer-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <aside
        className={`sds-drawer sds-drawer--${side} ${className}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        {...rest}
      >
        <header className="sds-drawer__header">
          <div className="sds-drawer__titles">
            {title && <h2 className="sds-drawer__title">{title}</h2>}
            {description && <p className="sds-drawer__desc">{description}</p>}
          </div>
          <button type="button" className="sds-iconbtn sds-iconbtn--sm" aria-label="Close" onClick={() => onClose && onClose()}>
            <Icon name="x-mark" size={18} />
          </button>
        </header>
        <div className="sds-drawer__body">{children}</div>
        {footer && <footer className="sds-drawer__footer">{footer}</footer>}
      </aside>
    </div>
  );
}

/** DrawerField — a label / value row for detail drawers. */
export function DrawerField({ label, children, className = '' }) {
  return (
    <div className={`sds-drawer-field ${className}`}>
      <dt className="sds-drawer-field__label">{label}</dt>
      <dd className="sds-drawer-field__value">{children}</dd>
    </div>
  );
}
