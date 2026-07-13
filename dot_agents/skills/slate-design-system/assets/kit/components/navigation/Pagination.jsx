import React from 'react';
import { Icon } from '../core/Icon.jsx';

function pageList(page, pageCount, siblingCount) {
  const pages = new Set([1, pageCount]);
  for (let p = page - siblingCount; p <= page + siblingCount; p++) {
    if (p >= 1 && p <= pageCount) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev === 2) out.push(prev + 1);
    else if (p - prev > 2) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

/** Pagination — numbered pages with prev/next. 1-indexed. */
export function Pagination({ page = 1, pageCount = 1, onChange, siblingCount = 1, className = '', ...rest }) {
  const go = (p) => { if (onChange && p >= 1 && p <= pageCount && p !== page) onChange(p); };
  return (
    <nav className={`sds-pagination ${className}`} aria-label="Pagination" {...rest}>
      <button type="button" className="sds-pagination__btn" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous page">
        <Icon name="chevron-left" size={14} />
      </button>
      {pageList(page, pageCount, siblingCount).map((p, i) =>
        p === '…' ? (
          <span className="sds-pagination__ellipsis" key={`e${i}`} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`sds-pagination__btn ${p === page ? 'sds-pagination__btn--current' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        )
      )}
      <button type="button" className="sds-pagination__btn" disabled={page >= pageCount} onClick={() => go(page + 1)} aria-label="Next page">
        <Icon name="chevron-right" size={14} />
      </button>
    </nav>
  );
}
