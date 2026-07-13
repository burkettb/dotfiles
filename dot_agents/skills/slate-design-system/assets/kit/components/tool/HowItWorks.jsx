import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * HowItWorks — the collapsible methodology block. Closed by default so the
 * tool stays the page; open it and the explanation reads like documentation.
 */
export function HowItWorks({ title = 'How it works', defaultOpen = false, children, className = '', ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className={`sds-tl-how ${className}`} {...rest}>
      <button type="button" className="sds-tl-how__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="chevron-down" size={15} className={`sds-tl-how__chev ${open ? 'sds-tl-how__chev--open' : ''}`} />
        {title}
      </button>
      {open && <div className="sds-tl-how__body">{children}</div>}
    </section>
  );
}

/** RelatedToolsGrid — quiet links to sibling utilities. */
export function RelatedToolsGrid({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-tl-related ${className}`} {...rest}>
      <h2 className="sds-tl-related__label">Related tools</h2>
      <div className="sds-tl-related__grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {items.map((t) => (
          <a className="sds-tl-related__item" key={t.name} href={t.href || '#'}>
            {t.icon && <Icon name={t.icon} size={17} className="sds-tl-related__icon" />}
            <span className="sds-tl-related__name">{t.name}</span>
            {t.desc && <span className="sds-tl-related__desc">{t.desc}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
