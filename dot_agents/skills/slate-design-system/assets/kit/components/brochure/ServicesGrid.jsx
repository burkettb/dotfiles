import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { ReviewStars } from './ReviewCards.jsx';

/**
 * ServicesGrid — icon cards for what the business does. Each card can link to
 * a service page; keep titles plain ("Water Heater Repair", not "Solutions").
 */
export function ServicesGrid({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-br-services ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((s) => (
        <a className="sds-br-service" key={s.title} href={s.href || '#'} onClick={(e) => { if (s.onClick) { e.preventDefault(); s.onClick(s); } }}>
          {s.icon && <span className="sds-br-service__icon"><Icon name={s.icon} size={22} /></span>}
          <h3 className="sds-br-service__title">{s.title}</h3>
          {s.body && <p className="sds-br-service__body">{s.body}</p>}
          <span className="sds-br-service__more">Learn more <Icon name="chevron-right" size={13} /></span>
        </a>
      ))}
    </div>
  );
}

/**
 * TrustStrip — the credibility row: years in business, licensed & insured,
 * review rating. Facts only, each with a small glyph.
 */
export function TrustStrip({ items, years, licensed = true, rating, reviewCount, source = 'Google', className = '', ...rest }) {
  const auto = [];
  if (years) auto.push({ icon: 'calendar', label: `${years} years in business` });
  if (licensed) auto.push({ icon: 'shield-check', label: 'Licensed & insured' });
  if (rating) auto.push({ stars: rating, label: `${rating.toFixed(1)} · ${reviewCount ? `${reviewCount} ${source} reviews` : source}` });
  const list = items || auto;
  return (
    <div className={`sds-br-trust ${className}`} {...rest}>
      {list.map((it, i) => (
        <span className="sds-br-trust__item" key={i}>
          {it.stars ? <ReviewStars rating={it.stars} size={14} /> : it.icon && <Icon name={it.icon} size={16} className="sds-br-trust__icon" />}
          <span>{it.label}</span>
        </span>
      ))}
    </div>
  );
}
