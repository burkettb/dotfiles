import React from 'react';

/**
 * Spinner — indeterminate loading indicator. Functional, never decorative.
 * Slows (rather than freezes) under prefers-reduced-motion.
 */
export function Spinner({ size = 'md', label = 'Loading', className = '', ...rest }) {
  const mod = size === 'md' ? '' : `sds-spinner--${size}`;
  return <span className={`sds-spinner ${mod} ${className}`} role="status" aria-label={label} {...rest} />;
}
