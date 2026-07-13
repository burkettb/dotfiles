import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * FAQAccordion — expandable question list. One open at a time by default
 * (pass `multiple` to allow several). Chevron rotates; motion is restrained.
 */
export function FAQAccordion({ items = [], multiple = false, className = '', ...rest }) {
  const [open, setOpen] = React.useState(() => new Set([0]));
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div className={`sds-mk-faq ${className}`} {...rest}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div className="sds-mk-faq__item" key={it.q}>
            <button type="button" className="sds-mk-faq__q" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span>{it.q}</span>
              <Icon name="chevron-down" size={16} className={`sds-mk-faq__chev ${isOpen ? 'sds-mk-faq__chev--open' : ''}`} />
            </button>
            {isOpen && <div className="sds-mk-faq__a">{it.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * StatsBand — a row of big earned numbers with muted labels. Use real,
 * specific figures; no decorative stat-slop.
 */
export function StatsBand({ items = [], className = '', ...rest }) {
  return (
    <div className={`sds-mk-stats ${className}`} {...rest}>
      {items.map((s) => (
        <div className="sds-mk-stats__item" key={s.label}>
          <div className="sds-mk-stats__value">{s.value}</div>
          <div className="sds-mk-stats__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
