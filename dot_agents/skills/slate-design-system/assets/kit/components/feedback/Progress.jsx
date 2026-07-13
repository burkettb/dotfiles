import React from 'react';

/**
 * Progress — a determinate linear bar. Optional label row above the track.
 * For unknown duration use Spinner instead.
 */
export function Progress({ value = 0, max = 100, label, showValue = false, tone, className = '', ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`sds-progress ${className}`} {...rest}>
      {(label || showValue) && (
        <div className="sds-progress__meta">
          <span>{label}</span>
          {showValue && <span className="sds-progress__value">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="sds-progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={typeof label === 'string' ? label : undefined}>
        <div className={`sds-progress__bar ${tone ? `sds-progress__bar--${tone}` : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
