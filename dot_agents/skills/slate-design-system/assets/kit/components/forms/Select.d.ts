import type { ReactNode } from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helpText?: string;
  error?: string;
  /** Success message; validated treatment. Ignored if `error` is set. */
  success?: string;
  required?: boolean;
  /** Options as strings or { value, label }. Omit to pass <option> children. */
  options?: (string | SelectOption)[];
  /** Disabled first option shown when nothing is selected. */
  placeholder?: string;
  children?: ReactNode;
}
export function Select(props: SelectProps): JSX.Element;
