import type { ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Footer actions (right-aligned). One solid primary at most. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}
export function Dialog(props: DialogProps): JSX.Element | null;
