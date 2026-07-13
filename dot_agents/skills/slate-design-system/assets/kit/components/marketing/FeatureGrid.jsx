import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** SectionHeading — shared eyebrow + title + lead block for marketing sections. */
export function SectionHeading({ eyebrow, title, lead, align = 'center', className = '' }) {
  return (
    <div className={`sds-mk-sechead sds-mk-sechead--${align} ${className}`}>
      {eyebrow && <p className="sds-mk-eyebrow">{eyebrow}</p>}
      {title && <h2 className="sds-mk-sechead__title">{title}</h2>}
      {lead && <p className="sds-mk-sechead__lead">{lead}</p>}
    </div>
  );
}

/**
 * FeatureGrid — an icon grid of capabilities. Each item: icon, title, body.
 * Icons earn their place here (one per feature, one weight).
 */
export function FeatureGrid({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-mk-featgrid ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((it) => (
        <div className="sds-mk-feat" key={it.title}>
          {it.icon && <span className="sds-mk-feat__icon"><Icon name={it.icon} size={20} /></span>}
          <h3 className="sds-mk-feat__title">{it.title}</h3>
          <p className="sds-mk-feat__body">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * FeatureRows — alternating image/text rows. Media flips sides automatically;
 * pass `media` per item (ImagePlaceholder until real screenshots exist).
 */
export function FeatureRows({ items = [], className = '', ...rest }) {
  return (
    <div className={`sds-mk-featrows ${className}`} {...rest}>
      {items.map((it, i) => (
        <div className={`sds-mk-featrow ${i % 2 ? 'sds-mk-featrow--flip' : ''}`} key={it.title}>
          <div className="sds-mk-featrow__copy">
            {it.eyebrow && <p className="sds-mk-eyebrow">{it.eyebrow}</p>}
            <h3 className="sds-mk-featrow__title">{it.title}</h3>
            {it.body && <p className="sds-mk-featrow__body">{it.body}</p>}
            {it.bullets && (
              <ul className="sds-mk-featrow__bullets">
                {it.bullets.map((b) => <li key={b}><Icon name="check" size={15} className="sds-mk-featrow__check" />{b}</li>)}
              </ul>
            )}
          </div>
          <div className="sds-mk-featrow__media">{it.media}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * BentoGrid — a mixed-size feature mosaic. Items place onto a 6-column grid;
 * `span` (columns) and `rows` control each cell's footprint.
 */
export function BentoGrid({ items = [], className = '', ...rest }) {
  return (
    <div className={`sds-mk-bento ${className}`} {...rest}>
      {items.map((it) => (
        <div className="sds-mk-bento__cell" key={it.title} style={{ gridColumn: `span ${it.span || 2}`, gridRow: it.rows ? `span ${it.rows}` : undefined }}>
          <div className="sds-mk-bento__copy">
            {it.icon && <span className="sds-mk-feat__icon"><Icon name={it.icon} size={18} /></span>}
            <h3 className="sds-mk-bento__title">{it.title}</h3>
            {it.body && <p className="sds-mk-bento__body">{it.body}</p>}
          </div>
          {it.media && <div className="sds-mk-bento__media">{it.media}</div>}
        </div>
      ))}
    </div>
  );
}
