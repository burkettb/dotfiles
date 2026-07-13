import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * NavItem — a sidebar navigation row. Active state is a 2–3px leading accent
 * bar + stronger text (no background fills beyond a subtle tint). Renders as
 * an <a> when `href` is given, otherwise a <button>.
 */
export function NavItem({ icon, active = false, href, className = '', children, ...rest }) {
  const cls = `sds-nav-item ${active ? 'sds-nav-item--active' : ''} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </>
  );
  if (href) {
    return <a href={href} className={cls} aria-current={active ? 'page' : undefined} {...rest}>{content}</a>;
  }
  return <button className={cls} aria-current={active ? 'page' : undefined} {...rest}>{content}</button>;
}
