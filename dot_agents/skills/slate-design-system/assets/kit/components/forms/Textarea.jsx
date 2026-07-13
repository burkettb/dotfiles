import React, { useId } from 'react';

/** Textarea — outlined multi-line field. Mirrors Input's label/help/error layout. */
export function Textarea({ label, helpText, error, success, required = false, id, className = '', rows = 4, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const describedBy = msg ? `${fieldId}-desc` : undefined;
  const stateCls = error ? 'sds-textarea--error' : success ? 'sds-textarea--success' : '';
  const helpCls = error ? 'sds-help--error' : success ? 'sds-help--success' : '';

  return (
    <div className="sds-field">
      {label && (
        <label className="sds-label" htmlFor={fieldId}>
          {label}{required && <span className="sds-label__req">*</span>}
        </label>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        className={`sds-textarea ${stateCls} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {msg && (
        <span id={describedBy} className={`sds-help ${helpCls}`}>
          {msg}
        </span>
      )}
    </div>
  );
}
