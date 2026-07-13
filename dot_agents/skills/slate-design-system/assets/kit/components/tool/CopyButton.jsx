import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

/**
 * CopyButton — copies `value` and confirms inline ("Copied") for 1.5s.
 * Falls back to a hidden textarea when the clipboard API is unavailable.
 */
export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', size = 'sm', variant = 'secondary', className = '', ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  const copy = async () => {
    const text = typeof value === 'function' ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Button size={size} variant={variant} className={`sds-tl-copy ${copied ? 'sds-tl-copy--done' : ''} ${className}`}
      leadingIcon={copied ? 'check' : 'clipboard'} onClick={copy} aria-live="polite" {...rest}>
      {copied ? copiedLabel : label}
    </Button>
  );
}

/** CodeBlock — mono output block with optional line wrap and built-in copy. */
export function CodeBlock({ children, code, wrap = false, copyable = true, label, className = '', ...rest }) {
  const text = code != null ? code : typeof children === 'string' ? children : '';
  return (
    <div className={`sds-tl-code ${className}`} {...rest}>
      {(label || copyable) && (
        <div className="sds-tl-code__bar">
          <span className="sds-tl-code__label">{label}</span>
          {copyable && <CopyButton value={text} variant="ghost" />}
        </div>
      )}
      <pre className={`sds-tl-code__pre ${wrap ? 'sds-tl-code__pre--wrap' : ''}`}><code>{code != null ? code : children}</code></pre>
    </div>
  );
}

/**
 * ResultCard — the emphasized answer. One number or line, framed in the
 * accent — the only loud element on a tool page.
 */
export function ResultCard({ label, value, detail, actions, className = '', ...rest }) {
  return (
    <div className={`sds-tl-result ${className}`} {...rest}>
      {label && <div className="sds-tl-result__label">{label}</div>}
      <div className="sds-tl-result__value">{value}</div>
      {detail && <div className="sds-tl-result__detail">{detail}</div>}
      {actions && <div className="sds-tl-result__actions">{actions}</div>}
    </div>
  );
}

/** ShareExportRow — quiet row of share/export actions under a result. */
export function ShareExportRow({ items = [], className = '', ...rest }) {
  return (
    <div className={`sds-tl-share ${className}`} {...rest}>
      {items.map((it) => (
        <button key={it.label} type="button" className="sds-tl-share__btn" onClick={it.onClick}>
          {it.icon && <Icon name={it.icon} size={15} />}{it.label}
        </button>
      ))}
    </div>
  );
}
