import React from 'react';

/**
 * Skeleton — a placeholder block shown while content loads. A quiet slate
 * shimmer (no spinner). Set `variant` for common shapes or pass explicit
 * width/height. Respects prefers-reduced-motion (shimmer stops).
 */
export function Skeleton({ variant = 'line', width, height, lines = 1, radius, className = '', style = {}, ...rest }) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className={`sds-skeleton-lines ${className}`} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="sds-skeleton sds-skeleton--line"
            style={{ width: i === lines - 1 ? '70%' : '100%' }}
          />
        ))}
      </span>
    );
  }
  const s = { ...style };
  if (width != null) s.width = typeof width === 'number' ? `${width}px` : width;
  if (height != null) s.height = typeof height === 'number' ? `${height}px` : height;
  if (radius != null) s.borderRadius = typeof radius === 'number' ? `${radius}px` : radius;
  return (
    <span
      className={`sds-skeleton sds-skeleton--${variant} ${className}`}
      style={s}
      aria-hidden="true"
      {...rest}
    />
  );
}
