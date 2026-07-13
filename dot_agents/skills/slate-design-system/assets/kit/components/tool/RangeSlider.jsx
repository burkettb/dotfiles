import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * RangeSlider — a labeled slider with the current value displayed as a real
 * number (mono, right-aligned). Accent track fill.
 */
export function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, format, unit = '', helpText, className = '', ...rest }) {
  const pct = ((value - min) / (max - min)) * 100;
  const shown = format ? format(value) : `${value}${unit}`;
  return (
    <div className={`sds-tl-slider ${className}`}>
      <div className="sds-tl-slider__head">
        {label && <label className="sds-label">{label}</label>}
        <span className="sds-tl-slider__value">{shown}</span>
      </div>
      <input
        type="range" className="sds-tl-slider__input"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--accent) ${pct}%, var(--slate-200) ${pct}%)` }}
        {...rest}
      />
      {helpText && <span className="sds-help">{helpText}</span>}
    </div>
  );
}

/** Stepper — a numeric input with −/+ buttons; the unit sits inside the field. Clamps to min/max. */
export function Stepper({ label, value, onChange, min = -Infinity, max = Infinity, step = 1, unit = '', helpText, className = '', ...rest }) {
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const set = (n) => onChange && onChange(clamp(n));
  return (
    <div className={`sds-tl-stepper ${className}`}>
      {label && <label className="sds-label">{label}</label>}
      <div className="sds-tl-stepper__row">
        <button type="button" className="sds-tl-stepper__btn" aria-label="Decrease" disabled={value <= min} onClick={() => set(value - step)}><Icon name="minus" size={15} /></button>
        <div className="sds-tl-stepper__field">
          <input type="number" className="sds-tl-stepper__num" value={value} min={min === -Infinity ? undefined : min} max={max === Infinity ? undefined : max} step={step}
            onChange={(e) => set(Number(e.target.value))} {...rest} />
          {unit && <span className="sds-tl-stepper__unit">{unit}</span>}
        </div>
        <button type="button" className="sds-tl-stepper__btn" aria-label="Increase" disabled={value >= max} onClick={() => set(value + step)}><Icon name="plus" size={15} /></button>
      </div>
      {helpText && <span className="sds-help">{helpText}</span>}
    </div>
  );
}
