import React from 'react';

/**
 * Tabs — boxed / contained folder-style tabs attached to their panel, for
 * genuinely separate workspaces. `items` is [{ value, label }]; controlled
 * via `value` + `onChange`.
 */
export function Tabs({ items = [], value, onChange, className = '' }) {
  return (
    <div className={`sds-tabs ${className}`} role="tablist">
      {items.map((it) => {
        const item = typeof it === 'string' ? { value: it, label: it } : it;
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            className={`sds-tab ${active ? 'sds-tab--active' : ''}`}
            onClick={() => onChange && onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
