export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  error?: string;
  /** Success message; validated treatment. Ignored if `error` is set. */
  success?: string;
  required?: boolean;
}
export function Textarea(props: TextareaProps): JSX.Element;
