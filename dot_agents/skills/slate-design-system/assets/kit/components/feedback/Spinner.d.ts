export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label announced to screen readers. */
  label?: string;
}
export function Spinner(props: SpinnerProps): JSX.Element;
