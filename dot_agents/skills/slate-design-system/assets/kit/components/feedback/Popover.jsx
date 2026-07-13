import React from 'react';

/**
 * Popover — a generic floating panel anchored to a trigger. For lists of
 * actions use Menu; this is for arbitrary content (filters, pickers, help).
 * Controlled via `open`/`onOpenChange`, or uncontrolled by default.
 */
export function Popover({ trigger, align = 'left', open: openProp, onOpenChange, children, className = '', ...rest }) {
  const [internal, setInternal] = React.useState(false);
  const open = openProp != null ? openProp : internal;
  const setOpen = (v) => { if (openProp == null) setInternal(v); if (onOpenChange) onOpenChange(v); };
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
    <div className={`sds-popover-wrap ${className}`} ref={ref} {...rest}>
      {React.cloneElement(trigger, {
        onClick: (e) => { if (trigger.props.onClick) trigger.props.onClick(e); setOpen(!open); },
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
      })}
      {open && (
        <div className={`sds-popover ${align === 'right' ? 'sds-popover--right' : ''}`} role="dialog">
          {children}
        </div>
      )}
    </div>
  );
}
