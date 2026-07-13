import React from 'react';
import { Avatar } from '../core/Avatar.jsx';

/**
 * TestimonialGrid — quote cards with concrete, earned claims (house rule:
 * no star ratings in marketing; numbers do the persuading).
 */
export function TestimonialGrid({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-mk-testgrid ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((t) => (
        <figure className="sds-mk-quote" key={t.name}>
          <blockquote className="sds-mk-quote__text">“{t.quote}”</blockquote>
          <figcaption className="sds-mk-quote__who">
            <Avatar name={t.name} size="sm" src={t.avatar} />
            <div>
              <div className="sds-mk-quote__name">{t.name}</div>
              {t.role && <div className="sds-mk-quote__role">{t.role}</div>}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * LogoWall — a muted strip of customer wordmarks. Renders plain-type
 * wordmarks by default; pass `logo` (node) per item when real assets exist.
 */
export function LogoWall({ items = [], label, className = '', ...rest }) {
  return (
    <div className={`sds-mk-logowall ${className}`} {...rest}>
      {label && <p className="sds-mk-logowall__label">{label}</p>}
      <div className="sds-mk-logowall__row">
        {items.map((it) => {
          const name = typeof it === 'string' ? it : it.name;
          const logo = typeof it === 'string' ? null : it.logo;
          return <span className="sds-mk-logowall__item" key={name}>{logo || name}</span>;
        })}
      </div>
    </div>
  );
}
