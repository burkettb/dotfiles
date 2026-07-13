import React, { useId } from 'react';

/**
 * Checkbox — square control with a check glyph. Label sits to the right.
 * Pass `error`/`success` for a validated state and `helpText` for a hint;
 * any of the three renders a message line below the control.
 */
export function Checkbox({ label, helpText, error, success, className = '', id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const state = error ? 'error' : success ? 'success' : '';
  const control = (
    <label className={`sds-choice ${className}`} htmlFor={fieldId}>
      <input id={fieldId} type="checkbox" aria-invalid={error ? true : undefined} {...rest} />
      <span className={`sds-choice__box ${state ? `sds-choice__box--${state}` : ''}`} aria-hidden="true">
        <svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2l2.6 2.6L10 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
  if (!msg) return control;
  return (
    <div className="sds-choice-field">
      {control}
      <span className={`sds-help ${error ? 'sds-help--error' : success ? 'sds-help--success' : ''}`}>{msg}</span>
    </div>
  );
}
