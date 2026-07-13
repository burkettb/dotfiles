import React, { useId } from 'react';

/**
 * Select — outlined native dropdown with a custom chevron. Pass `options` as
 * an array of { value, label } (or plain strings), or provide <option> children.
 */
export function Select({
  label,
  helpText,
  error,
  success,
  required = false,
  options,
  placeholder,
  id,
  className = '',
  children,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const msg = error || success || helpText;
  const describedBy = msg ? `${fieldId}-desc` : undefined;
  const stateCls = error ? 'sds-select--error' : success ? 'sds-select--success' : '';
  const helpCls = error ? 'sds-help--error' : success ? 'sds-help--success' : '';

  return (
    <div className="sds-field">
      {label && (
        <label className="sds-label" htmlFor={fieldId}>
          {label}{required && <span className="sds-label__req">*</span>}
        </label>
      )}
      <select
        id={fieldId}
        className={`sds-select ${stateCls} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options
          ? options.map((o) => {
              const opt = typeof o === 'string' ? { value: o, label: o } : o;
              return <option key={opt.value} value={opt.value}>{opt.label}</option>;
            })
          : children}
      </select>
      {msg && (
        <span id={describedBy} className={`sds-help ${helpCls}`}>
          {msg}
        </span>
      )}
    </div>
  );
}
