import React, { useId } from 'react';

/**
 * Input — outlined text field. Label above, helper/error below (the house
 * form layout). Pass `error` to switch to the invalid treatment.
 */
export function Input({
  label,
  helpText,
  error,
  success,
  required = false,
  id,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const describedBy = msg ? `${fieldId}-desc` : undefined;
  const stateCls = error ? 'sds-input--error' : success ? 'sds-input--success' : '';
  const helpCls = error ? 'sds-help--error' : success ? 'sds-help--success' : '';

  return (
    <div className="sds-field">
      {label && (
        <label className="sds-label" htmlFor={fieldId}>
          {label}{required && <span className="sds-label__req">*</span>}
        </label>
      )}
      <input
        id={fieldId}
        className={`sds-input ${stateCls} ${className}`}
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
