import React from 'react';

/**
 * Badge — status as a colored round dot + plain text, no container (quiet —
 * the Apple treatment). `boxed` adds a hairline chip for dense contexts.
 * `danger` escalates to red text. Round dot = state; Tag's square = category.
 */
export function Badge({ tone = 'neutral', dot = true, boxed = false, className = '', children, ...rest }) {
  return (
    <span className={`sds-badge sds-badge--${tone} ${boxed ? 'sds-badge--boxed' : ''} ${className}`} {...rest}>
      {dot && <span className="sds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
