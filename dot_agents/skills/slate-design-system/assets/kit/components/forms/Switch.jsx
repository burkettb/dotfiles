import React, { useId } from 'react';

/**
 * Switch — a binary toggle for immediate on/off settings. Label sits to the right.
 * Pass `error`/`success` for a validated state and `helpText` for a hint.
 */
export function Switch({ label, helpText, error, success, className = '', id, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const state = error ? 'error' : success ? 'success' : '';
  const control = (
    <label className={`sds-switch ${className}`} htmlFor={fieldId}>
      <input id={fieldId} type="checkbox" role="switch" aria-invalid={error ? true : undefined} {...rest} />
      <span className={`sds-switch__track ${state ? `sds-switch__track--${state}` : ''}`} aria-hidden="true">
        <span className="sds-switch__thumb" />
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
