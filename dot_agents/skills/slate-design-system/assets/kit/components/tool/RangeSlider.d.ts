import type { ReactNode } from 'react';

export interface RangeSliderProps {
  label?: ReactNode;
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Custom value formatter, e.g. (v) => `$${v.toLocaleString()}`. */
  format?: (v: number) => string;
  unit?: string;
  helpText?: ReactNode;
  className?: string;
}
export function RangeSlider(props: RangeSliderProps): JSX.Element;

export interface StepperProps {
  label?: ReactNode;
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: ReactNode;
  className?: string;
}
export function Stepper(props: StepperProps): JSX.Element;
