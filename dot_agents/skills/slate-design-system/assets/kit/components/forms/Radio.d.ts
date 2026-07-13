export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered to the right. Give grouped radios a shared `name`. */
  label?: string;
  helpText?: string;
  error?: string;
  success?: string;
}
export function Radio(props: RadioProps): JSX.Element;
