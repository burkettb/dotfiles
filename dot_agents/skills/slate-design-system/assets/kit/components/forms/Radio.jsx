import React, { useId } from 'react';

/**
 * Radio — round single-choice control. Give a shared `name` to group radios.
 * Pass `error`/`success` for a validated state and `helpText` for a hint.
 */
export function Radio({ label, helpText, error, success, className = '', id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const state = error ? 'error' : success ? 'success' : '';
  const control = (
    <label className={`sds-choice ${className}`} htmlFor={fieldId}>
      <input id={fieldId} type="radio" aria-invalid={error ? true : undefined} {...rest} />
      <span className={`sds-choice__box sds-choice__box--radio ${state ? `sds-choice__box--${state}` : ''}`} aria-hidden="true">
        <span className="sds-choice__dot" />
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
