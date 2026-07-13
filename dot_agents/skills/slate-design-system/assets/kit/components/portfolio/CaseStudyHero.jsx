import React from 'react';
import { Tag } from '../core/Tag.jsx';
import { Icon } from '../core/Icon.jsx';
import { ImagePlaceholder } from '../core/ImagePlaceholder.jsx';

/**
 * CaseStudyHero — opens a case study: title, one-line summary, fact list
 * (role, timeline, outcome), and a full-bleed cover slot.
 */
export function CaseStudyHero({ eyebrow, title, summary, facts = [], cover, className = '', ...rest }) {
  return (
    <header className={`sds-pf-cshero ${className}`} {...rest}>
      <div className="sds-pf-cshero__copy">
        {eyebrow && <p className="sds-pf-eyebrow">{eyebrow}</p>}
        <h1 className="sds-pf-cshero__title">{title}</h1>
        {summary && <p className="sds-pf-cshero__summary">{summary}</p>}
        {facts.length > 0 && (
          <dl className="sds-pf-cshero__facts">
            {facts.map((f) => (
              <div className="sds-pf-cshero__fact" key={f.label}>
                <dt>{f.label}</dt><dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {cover && <div className="sds-pf-cshero__cover">{cover}</div>}
    </header>
  );
}

/**
 * CaseStudySection — a numbered narrative block (Problem / Solution / Outcome).
 * `kind` colors the marker; content is plain prose children.
 */
export function CaseStudySection({ kind = 'problem', index, title, children, media, className = '', ...rest }) {
  return (
    <section className={`sds-pf-cssec sds-pf-cssec--${kind} ${className}`} {...rest}>
      <div className="sds-pf-cssec__rail">
        <span className="sds-pf-cssec__num">{index}</span>
      </div>
      <div className="sds-pf-cssec__body">
        <h2 className="sds-pf-cssec__title">{title}</h2>
        <div className="sds-pf-cssec__prose">{children}</div>
        {media && <div className="sds-pf-cssec__media">{media}</div>}
      </div>
    </section>
  );
}

/**
 * GalleryLightbox — an image grid that opens a full-screen lightbox with
 * prev/next and Escape to close. Items: { label, media?, caption? }.
 */
export function GalleryLightbox({ items = [], columns = 3, className = '', ...rest }) {
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => {
    if (open == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, items.length]);

  return (
    <div className={`sds-pf-gallery ${className}`} {...rest}>
      <div className="sds-pf-gallery__grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {items.map((it, i) => (
          <button type="button" className="sds-pf-gallery__thumb" key={it.label} onClick={() => setOpen(i)} aria-label={`Open ${it.label}`}>
            {it.media || <ImagePlaceholder label={it.label} ratio="4/3" radius="0" />}
          </button>
        ))}
      </div>
      {open != null && (
        <div className="sds-pf-lightbox" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <button type="button" className="sds-pf-lightbox__close" aria-label="Close" onClick={() => setOpen(null)}><Icon name="x-mark" size={20} /></button>
          <button type="button" className="sds-pf-lightbox__nav sds-pf-lightbox__nav--prev" aria-label="Previous" onClick={() => setOpen((open - 1 + items.length) % items.length)}><Icon name="chevron-right" size={20} style={{ transform: 'rotate(180deg)' }} /></button>
          <figure className="sds-pf-lightbox__stage">
            {items[open].media || <ImagePlaceholder label={items[open].label} ratio="16/10" />}
            <figcaption className="sds-pf-lightbox__caption">{items[open].caption || items[open].label} · {open + 1} / {items.length}</figcaption>
          </figure>
          <button type="button" className="sds-pf-lightbox__nav" aria-label="Next" onClick={() => setOpen((open + 1) % items.length)}><Icon name="chevron-right" size={20} /></button>
        </div>
      )}
    </div>
  );
}
