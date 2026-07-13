import React from 'react';

const SIZES = { xs: 20, sm: 28, md: 36, lg: 48, xl: 64 };

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Avatar — a person or entity marker. Shows an image when `src` loads,
 * otherwise falls back to initials on a quiet slate tint. Pill radius (the
 * one place rounding is allowed). Optional `status` dot for presence.
 */
export function Avatar({ src, name = '', size = 'md', status, className = '', ...rest }) {
  const px = SIZES[size] || SIZES.md;
  const [broken, setBroken] = React.useState(false);
  const showImg = src && !broken;

  return (
    <span
      className={`sds-avatar sds-avatar--${size} ${className}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label={name || undefined}
      {...rest}
    >
      {showImg ? (
        <img className="sds-avatar__img" src={src} alt={name} onError={() => setBroken(true)} />
      ) : (
        <span className="sds-avatar__initials" aria-hidden="true">{initialsOf(name)}</span>
      )}
      {status && <span className={`sds-avatar__status sds-avatar__status--${status}`} aria-hidden="true" />}
    </span>
  );
}

/**
 * AvatarGroup — overlapping stack of avatars with an optional +N overflow chip.
 */
export function AvatarGroup({ max, size = 'md', className = '', children, ...rest }) {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const extra = max ? items.length - shown.length : 0;
  const px = SIZES[size] || SIZES.md;
  return (
    <span className={`sds-avatar-group ${className}`} {...rest}>
      {shown.map((child, i) => (
        <span className="sds-avatar-group__item" key={i}>
          {React.isValidElement(child) ? React.cloneElement(child, { size }) : child}
        </span>
      ))}
      {extra > 0 && (
        <span className="sds-avatar-group__item">
          <span className="sds-avatar sds-avatar--more" style={{ width: px, height: px }} aria-label={`${extra} more`}>
            <span className="sds-avatar__initials">+{extra}</span>
          </span>
        </span>
      )}
    </span>
  );
}
