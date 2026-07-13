import React, { useEffect } from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Dialog — a centered modal for short forms (≤6 fields) and confirmations.
 * Floating layer: soft small shadow, scrim behind. Controlled via `open`.
 * Longer flows should escalate to a full page, never a scrolling modal.
 */
export function Dialog({ open, onClose, title, description, footer, children, className = '' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sds-dialog-overlay" onClick={onClose} role="presentation">
      <div
        className={`sds-dialog ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="sds-dialog__header">
            {title && <h2 className="sds-dialog__title">{title}</h2>}
            {description && <p className="sds-dialog__desc">{description}</p>}
          </div>
        )}
        {children && <div className="sds-dialog__body">{children}</div>}
        {footer && <div className="sds-dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
