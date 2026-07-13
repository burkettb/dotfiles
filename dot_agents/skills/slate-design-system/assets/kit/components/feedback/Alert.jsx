import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONE_ICON = {
  info: 'bell-alert',
  success: 'check-circle',
  warning: 'bell-alert',
  danger: 'bell-alert',
};

/**
 * Alert — an inline, in-flow message tied to a region of the page (not a
 * floating toast). Tinted from the semantic palette; hue carries the meaning,
 * so it stays quiet against slate. Optional title, dismiss, and actions.
 */
export function Alert({
  tone = 'info',
  title,
  icon,
  onDismiss,
  actions,
  className = '',
  children,
  ...rest
}) {
  const glyph = icon === false ? null : (icon || TONE_ICON[tone] || 'bell-alert');
  return (
    <div className={`sds-alert sds-alert--${tone} ${className}`} role={tone === 'danger' ? 'alert' : 'status'} {...rest}>
      {glyph && <Icon name={glyph} size={18} className="sds-alert__icon" />}
      <div className="sds-alert__content">
        {title && <p className="sds-alert__title">{title}</p>}
        {children && <div className="sds-alert__body">{children}</div>}
        {actions && <div className="sds-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="sds-alert__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="x-mark" size={16} />
        </button>
      )}
    </div>
  );
}
