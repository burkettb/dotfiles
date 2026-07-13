import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * IconButton — a square, icon-only action (toolbars, table row actions, close).
 * Always pass `label` for accessibility. Ghost by default; `outline` for
 * standalone controls that need a visible boundary.
 */
export function IconButton({
  icon,
  label,
  size = 'md',
  outline = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const cls = [
    'sds-iconbtn',
    size === 'sm' && 'sds-iconbtn--sm',
    outline && 'sds-iconbtn--outline',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} aria-label={label} title={label} disabled={disabled} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 16 : 18} />
    </button>
  );
}
