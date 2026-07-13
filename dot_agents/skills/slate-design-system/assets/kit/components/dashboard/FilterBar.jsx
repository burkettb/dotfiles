import React from 'react';
import { Icon } from '../core/Icon.jsx';

function usePopover() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  return { open, setOpen, ref };
}

/** FilterBar — a hairline-bordered row hosting a date range + filter chips. */
export function FilterBar({ children, actions, className = '', ...rest }) {
  return (
    <div className={`sds-filterbar ${className}`} {...rest}>
      <div className="sds-filterbar__group">{children}</div>
      {actions && <div className="sds-filterbar__actions">{actions}</div>}
    </div>
  );
}

const DEFAULT_PRESETS = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'ytd', label: 'Year to date' },
  { key: '12m', label: 'Last 12 months' },
];

/** DateRangePicker — button + popover of presets. Controlled via value/onChange. */
export function DateRangePicker({ value, onChange, presets = DEFAULT_PRESETS, className = '' }) {
  const { open, setOpen, ref } = usePopover();
  const current = presets.find((p) => p.key === value) || presets[1];
  return (
    <div className={`sds-daterange ${className}`} ref={ref}>
      <button type="button" className="sds-chipbtn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <Icon name="chart-bar" size={15} className="sds-chipbtn__lead" />
        <span>{current ? current.label : 'Date range'}</span>
        <Icon name="chevron-right" size={13} className="sds-chipbtn__caret" />
      </button>
      {open && (
        <div className="sds-menu sds-daterange__pop" role="listbox">
          {presets.map((p) => (
            <button key={p.key} type="button" role="option" aria-selected={p.key === (current && current.key)}
              className={`sds-menu__item ${p.key === (current && current.key) ? 'sds-menu__item--active' : ''}`}
              onClick={() => { setOpen(false); onChange && onChange(p.key); }}>
              {p.key === (current && current.key) && <Icon name="check" size={15} />}
              <span style={{ marginLeft: p.key === (current && current.key) ? 0 : 22 }}>{p.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * MultiSelectFilter — a chip that opens a checkbox list. `value` is an array of
 * selected option keys; `onChange` gets the next array. Shows a count when active.
 */
export function MultiSelectFilter({ label, options = [], value = [], onChange, className = '' }) {
  const { open, setOpen, ref } = usePopover();
  const active = value.length > 0;
  const toggle = (k) => {
    const next = value.includes(k) ? value.filter((x) => x !== k) : [...value, k];
    onChange && onChange(next);
  };
  return (
    <div className={`sds-msfilter ${className}`} ref={ref}>
      <button type="button" className={`sds-chipbtn ${active ? 'sds-chipbtn--active' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="true" aria-expanded={open}>
        <span>{label}</span>
        {active && <span className="sds-chipbtn__count">{value.length}</span>}
        <Icon name="chevron-right" size={13} className="sds-chipbtn__caret" />
      </button>
      {open && (
        <div className="sds-menu sds-msfilter__pop">
          {options.map((o) => {
            const opt = typeof o === 'string' ? { key: o, label: o } : o;
            const checked = value.includes(opt.key);
            return (
              <label key={opt.key} className="sds-msfilter__opt">
                <input type="checkbox" checked={checked} onChange={() => toggle(opt.key)} />
                <span className="sds-choice__box" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2l2.6 2.6L10 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>{opt.label}</span>
              </label>
            );
          })}
          {active && (
            <React.Fragment>
              <div className="sds-menu__divider" />
              <button type="button" className="sds-menu__item" onClick={() => onChange && onChange([])}>Clear selection</button>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}
