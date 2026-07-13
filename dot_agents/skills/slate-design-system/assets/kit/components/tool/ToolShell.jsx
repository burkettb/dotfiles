import React from 'react';

/**
 * ToolShell — the single-purpose utility frame: a centered column with the
 * tool name, a one-line description, and nothing else competing. Minimal
 * chrome by design; the tool is the page.
 */
export function ToolShell({ name, description, badge, maxWidth = 860, footer, children, className = '', ...rest }) {
  return (
    <div className={`sds-tl-shell ${className}`} {...rest}>
      <main className="sds-tl-shell__col" style={{ maxWidth }}>
        <header className="sds-tl-shell__head">
          <h1 className="sds-tl-shell__name">{name}{badge && <span className="sds-tl-shell__badge">{badge}</span>}</h1>
          {description && <p className="sds-tl-shell__desc">{description}</p>}
        </header>
        {children}
        {footer && <footer className="sds-tl-shell__foot">{footer}</footer>}
      </main>
    </div>
  );
}

/**
 * ToolPanels — the input/output split: side-by-side on desktop, stacked on
 * mobile. Compose with InputPanel + OutputPanel children.
 */
export function ToolPanels({ children, ratio = '1fr 1fr', className = '', ...rest }) {
  return <div className={`sds-tl-panels ${className}`} style={{ gridTemplateColumns: ratio }} {...rest}>{children}</div>;
}

/** InputPanel — labeled input side of a tool. */
export function InputPanel({ title = 'Input', actions, children, className = '', ...rest }) {
  return (
    <section className={`sds-tl-panel ${className}`} {...rest}>
      <div className="sds-tl-panel__head"><h2 className="sds-tl-panel__title">{title}</h2>{actions && <div className="sds-tl-panel__actions">{actions}</div>}</div>
      <div className="sds-tl-panel__body">{children}</div>
    </section>
  );
}

/** OutputPanel — result side of a tool; visually quieter surface. */
export function OutputPanel({ title = 'Output', actions, children, className = '', ...rest }) {
  return (
    <section className={`sds-tl-panel sds-tl-panel--out ${className}`} {...rest}>
      <div className="sds-tl-panel__head"><h2 className="sds-tl-panel__title">{title}</h2>{actions && <div className="sds-tl-panel__actions">{actions}</div>}</div>
      <div className="sds-tl-panel__body">{children}</div>
    </section>
  );
}
