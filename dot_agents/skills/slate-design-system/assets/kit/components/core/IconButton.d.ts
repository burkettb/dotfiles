export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Heroicons solid icon name. */
  icon: string;
  /** Required accessible label (also used as the tooltip title). */
  label: string;
  size?: 'sm' | 'md';
  /** Show a 1px outline instead of ghost. */
  outline?: boolean;
}
export function IconButton(props: IconButtonProps): JSX.Element;
