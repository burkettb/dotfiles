import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** ReviewStars — 0–5 star rating row (halves round up visually). Brochure-only. */
export function ReviewStars({ rating = 5, size = 16, showValue = false, className = '' }) {
  return (
    <span className={`sds-br-stars ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} className={i <= Math.round(rating) ? 'sds-br-star--on' : 'sds-br-star--off'} />
      ))}
      {showValue && <span className="sds-br-stars__value">{rating.toFixed(1)}</span>}
    </span>
  );
}

/**
 * ReviewCards — review-style testimonials (stars + quote + name + source),
 * the way local customers actually judge a service business.
 */
export function ReviewCards({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-br-reviews ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((r) => (
        <figure className="sds-br-review" key={r.name}>
          <div className="sds-br-review__top">
            <ReviewStars rating={r.rating ?? 5} />
            {r.source && <span className="sds-br-review__source">{r.source}</span>}
          </div>
          <blockquote className="sds-br-review__text">“{r.quote}”</blockquote>
          <figcaption className="sds-br-review__who">
            <span className="sds-br-review__name">{r.name}</span>
            {r.meta && <span className="sds-br-review__meta">{r.meta}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
