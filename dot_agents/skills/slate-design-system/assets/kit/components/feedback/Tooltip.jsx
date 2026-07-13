import React from 'react';

/**
 * Tooltip — a small dark label on hover/focus for supplementary hints.
 * Wraps a single interactive child. Never put essential info only in a tooltip.
 */
export function Tooltip({ label, children, className = '' }) {
  return (
    <span className={`sds-tooltip-wrap ${className}`}>
      {children}
      <span className="sds-tooltip" role="tooltip">{label}</span>
    </span>
  );
}
