import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Sparkline — a tiny inline trend line (no axes). Accent stroke by default. */
export function Sparkline({ data = [], width = 96, height = 32, stroke = 'var(--chart-1)', fill = true, className = '' }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / span) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = React.useId ? React.useId().replace(/:/g, '') : `sp${Math.random().toString(36).slice(2)}`;
  return (
    <svg className={`sds-sparkline ${className}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {fill && (
        <React.Fragment>
          <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" /><stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient></defs>
          <path d={area} fill={`url(#${gid})`} />
        </React.Fragment>
      )}
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * StatCard — a KPI tile: label, big value, an optional up/down delta with its
 * semantic color, and an optional sparkline. Bordered, no shadow at rest.
 */
export function StatCard({ label, value, delta, deltaSuffix = 'vs. last period', sparkline, icon, className = '', ...rest }) {
  const dir = delta ? (delta.direction || (delta.value >= 0 ? 'up' : 'down')) : null;
  return (
    <div className={`sds-stat ${className}`} {...rest}>
      <div className="sds-stat__top">
        <span className="sds-stat__label">{label}</span>
        {icon && <span className="sds-stat__icon"><Icon name={icon} size={18} /></span>}
      </div>
      <div className="sds-stat__value">{value}</div>
      <div className="sds-stat__bottom">
        {delta && (
          <span className={`sds-stat__delta sds-stat__delta--${dir}`}>
            <svg className="sds-stat__delta-arrow" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none' }}>
              <path d="M5 1.5 L9 7 L1 7 Z" fill="currentColor" />
            </svg>
            {delta.label != null ? delta.label : `${delta.value > 0 ? '+' : ''}${delta.value}%`}
          </span>
        )}
        {delta && deltaSuffix && <span className="sds-stat__deltasuffix">{deltaSuffix}</span>}
        {sparkline && <span className="sds-stat__spark"><Sparkline data={sparkline} stroke={dir === 'down' ? 'var(--chart-down)' : 'var(--chart-1)'} /></span>}
      </div>
    </div>
  );
}
