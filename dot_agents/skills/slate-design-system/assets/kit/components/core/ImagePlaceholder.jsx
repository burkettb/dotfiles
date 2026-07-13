import React from 'react';

/**
 * ImagePlaceholder — a subtly striped stand-in for real imagery, with a
 * monospace label naming what should be dropped there. Use anywhere a design
 * calls for a photo, screenshot, or logo the user hasn't supplied yet.
 */
export function ImagePlaceholder({ label = 'image', ratio, height, radius = 'var(--radius-card)', className = '', style = {}, ...rest }) {
  const s = { borderRadius: radius, ...style };
  if (ratio) s.aspectRatio = ratio;
  if (height) s.height = typeof height === 'number' ? `${height}px` : height;
  return (
    <div className={`sds-imgph ${className}`} style={s} role="img" aria-label={`Placeholder: ${label}`} {...rest}>
      <span className="sds-imgph__label">{label}</span>
    </div>
  );
}
