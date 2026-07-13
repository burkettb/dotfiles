export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered to the right of the box. */
  label?: string;
  /** Hint line below the control. */
  helpText?: string;
  /** Error message + invalid treatment on the box. */
  error?: string;
  /** Success message + validated treatment. Ignored if `error` is set. */
  success?: string;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
