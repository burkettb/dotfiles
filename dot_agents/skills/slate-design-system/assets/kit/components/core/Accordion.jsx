import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * Accordion — generic disclosure list. items: [{ title, content }].
 * Single-open by default; pass `multiple` to allow several.
 * (FAQAccordion in marketing/ is the marketing-page variant.)
 */
export function Accordion({ items = [], defaultOpen = -1, multiple = false, className = '', ...rest }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen >= 0 ? [defaultOpen] : []));
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div className={`sds-accordion ${className}`} {...rest}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div className={`sds-accordion__item ${isOpen ? 'sds-accordion__item--open' : ''}`} key={i}>
            <button type="button" className="sds-accordion__trigger" aria-expanded={isOpen} onClick={() => toggle(i)}>
              {it.title}
              <Icon name="chevron-down" size={16} className="sds-accordion__chevron" />
            </button>
            {isOpen && <div className="sds-accordion__body">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
