import React from 'react';

/** Divider — hairline separator, optionally with a centered label. */
export function Divider({ label, className = '', ...rest }) {
  if (label) {
    return (
      <div className={`sds-divider--labeled ${className}`} role="separator" {...rest}>
        {label}
      </div>
    );
  }
  return <hr className={`sds-divider ${className}`} {...rest} />;
}
