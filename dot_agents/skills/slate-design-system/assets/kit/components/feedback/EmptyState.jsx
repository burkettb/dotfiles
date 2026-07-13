import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * EmptyState — the considered zero-data view. A muted icon in a soft slate
 * disc, a plain title, one specific sentence of guidance, and (usually) one
 * primary action. Copy says what will appear, never "Nothing here".
 */
export function EmptyState({
  icon = 'archive-box',
  title,
  description,
  action,
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <div className={`sds-empty sds-empty--${size} ${className}`} {...rest}>
      {icon && (
        <span className="sds-empty__icon" aria-hidden="true">
          <Icon name={icon} size={size === 'sm' ? 20 : 24} />
        </span>
      )}
      {title && <p className="sds-empty__title">{title}</p>}
      {description && <p className="sds-empty__desc">{description}</p>}
      {(action || children) && <div className="sds-empty__action">{action || children}</div>}
    </div>
  );
}
