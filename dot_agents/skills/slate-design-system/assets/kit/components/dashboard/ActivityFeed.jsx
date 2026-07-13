import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * ActivityFeed — a vertical timeline of events. Each item has a small marker
 * on a connecting rail, a title, optional meta/time, and optional body. The
 * marker tone maps to the semantic palette; hue carries the event kind.
 */
export function ActivityFeed({ items = [], className = '', ...rest }) {
  return (
    <ol className={`sds-feed ${className}`} {...rest}>
      {items.map((it, i) => (
        <li className="sds-feed__item" key={it.id || i}>
          <div className="sds-feed__rail">
            <span className={`sds-feed__marker sds-feed__marker--${it.tone || 'neutral'}`}>
              {it.icon ? <Icon name={it.icon} size={12} /> : it.avatar ? it.avatar : <span className="sds-feed__dot" />}
            </span>
          </div>
          <div className="sds-feed__content">
            <div className="sds-feed__head">
              <span className="sds-feed__title">
                {it.actor && <strong className="sds-feed__actor">{it.actor}</strong>} {it.title}
              </span>
              {it.time && <time className="sds-feed__time">{it.time}</time>}
            </div>
            {it.body && <div className="sds-feed__body">{it.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
