import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Menu — dropdown anchored to a trigger element. Click-away and Escape close
 * it. Items: { label, icon?, danger?, divider?, onSelect? }.
 */
export function Menu({ trigger, items = [], onSelect, align = 'left', header, className = '', ...rest }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div className={`sds-menu-wrap ${className}`} ref={ref} {...rest}>
      {React.cloneElement(trigger, {
        onClick: (e) => { if (trigger.props.onClick) trigger.props.onClick(e); setOpen((o) => !o); },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })}
      {open && (
        <div className={`sds-menu sds-menu--pop ${align === 'right' ? 'sds-menu--pop-right' : ''}`} role="menu">
          {header && <div className="sds-menu__header">{header}</div>}
          {items.map((it, i) =>
            it.divider ? (
              <div className="sds-menu__divider" key={`div-${i}`} />
            ) : (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                className={`sds-menu__item ${it.danger ? 'sds-menu__item--danger' : ''}`}
                onClick={() => { setOpen(false); if (it.onSelect) it.onSelect(it); if (onSelect) onSelect(it); }}
              >
                {it.icon && <Icon name={it.icon} size={16} />}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
