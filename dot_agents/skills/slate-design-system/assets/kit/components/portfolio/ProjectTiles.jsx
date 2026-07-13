import React from 'react';
import { Tag } from '../core/Tag.jsx';
import { ImagePlaceholder } from '../core/ImagePlaceholder.jsx';

/**
 * ProjectTiles — the work grid. Two variants:
 *
 * `variant="text"` (default) — type-led tiles: title, a one-line story, and a
 * mono meta row (platform · stack · year). Software rarely photographs well —
 * an ETL pipeline or a menu bar app has no hero shot — so the words carry it.
 *
 * `variant="media"` — image-forward tiles for work with a genuinely good
 * visual. Pass `media` per item (ImagePlaceholder until real shots exist).
 *
 * Hover keeps the house rule: flat tint, no movement, title underlines.
 */
export function ProjectTiles({ items = [], columns = 2, variant = 'text', onOpen, className = '', ...rest }) {
  return (
    <div className={`sds-pf-tiles ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((p) => (
        <a key={p.title} className={`sds-pf-tile ${variant === 'text' ? 'sds-pf-tile--text' : ''}`} href={p.href || '#'}
          onClick={(e) => { if (onOpen) { e.preventDefault(); onOpen(p); } }}>
          {variant === 'media' && (
            <div className="sds-pf-tile__media">
              {p.media || <ImagePlaceholder label={`project shot — ${p.title}`} ratio="4/3" radius="0" />}
            </div>
          )}
          {variant === 'text' && (
            <div className="sds-pf-tile__body">
              <span className="sds-pf-tile__title">{p.title}</span>
              {p.summary && <p className="sds-pf-tile__summary">{p.summary}</p>}
            </div>
          )}
          <div className="sds-pf-tile__bar">
            <div className="sds-pf-tile__text">
              {variant === 'media' && <span className="sds-pf-tile__title">{p.title}</span>}
              {variant === 'media' && p.subtitle && <span className="sds-pf-tile__sub">{p.subtitle}</span>}
              {variant === 'text' && p.meta && <span className="sds-pf-tile__meta">{p.meta}</span>}
            </div>
            {p.tags && (
              <span className="sds-pf-tile__tags">
                {p.tags.map((t) => <Tag key={t} hue={p.tagHue || 'blue'}>{t}</Tag>)}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
