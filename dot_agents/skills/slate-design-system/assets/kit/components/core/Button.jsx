import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * Button — the primary action primitive.
 * House rule: exactly ONE solid (primary) button per view; secondary is
 * ghost/outline; destructive is outline-red until confirmed. Never two solid
 * buttons side by side.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'sds-btn',
    `sds-btn--${variant}`,
    size !== 'md' && `sds-btn--${size}`,
    fullWidth && 'sds-btn--full',
    className,
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 19 : 16;

  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="sds-btn__spinner" aria-hidden="true" />}
      {!loading && leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      {children}
      {!loading && trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
    </button>
  );
}
