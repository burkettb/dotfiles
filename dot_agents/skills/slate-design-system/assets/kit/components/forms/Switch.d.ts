export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered to the right of the track. */
  label?: string;
  helpText?: string;
  error?: string;
  success?: string;
}
export function Switch(props: SwitchProps): JSX.Element;
