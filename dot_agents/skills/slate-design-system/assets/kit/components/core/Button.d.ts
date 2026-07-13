import type { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. Exactly one `primary` per view. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Heroicons solid name rendered before the label. */
  leadingIcon?: string;
  /** Heroicons solid name rendered after the label. */
  trailingIcon?: string;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * The primary action primitive.
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost & destructive actions" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
