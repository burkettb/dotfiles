export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the field. */
  label?: string;
  /** Helper text under the field (hidden when `error` is set). */
  helpText?: string;
  /** Error message; switches the field to the invalid treatment. */
  error?: string;
  /** Success message; switches the field to the validated treatment. Ignored if `error` is set. */
  success?: string;
  required?: boolean;
}
/**
 * Outlined text field with label-above / helper-below layout.
 * @startingPoint section="Forms" subtitle="Text field with label, helper text & inline error" viewport="700x150"
 */
export function Input(props: InputProps): JSX.Element;
