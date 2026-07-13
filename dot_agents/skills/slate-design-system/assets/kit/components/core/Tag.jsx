import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * Tag — a categorical label: square hue swatch (same solids as chart series)
 * + plain text, no container. `hue` (blue / teal / violet / amber / rose)
 * should carry a stable meaning. `boxed` adds a hairline chip; pass
 * `onRemove` for a removable filter chip (usually boxed).
 */
export function Tag({ hue = 'blue', boxed = false, onRemove, className = '', children, ...rest }) {
  return (
    <span className={`sds-tag sds-tag--${hue} ${boxed ? 'sds-tag--boxed' : ''} ${className}`} {...rest}>
      {children}
      {onRemove && (
        <span
          className="sds-tag__x"
          role="button"
          aria-label="Remove"
          tabIndex={0}
          onClick={onRemove}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRemove(e)}
        >
          <Icon name="x-mark" size={13} />
        </span>
      )}
    </span>
  );
}
