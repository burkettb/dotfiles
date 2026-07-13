import type { ReactNode } from 'react';

export interface DrawerProps extends React.HTMLAttributes<HTMLElement> {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  side?: 'right' | 'left';
  width?: number | string;
  footer?: ReactNode;
  children?: ReactNode;
}
export function Drawer(props: DrawerProps): JSX.Element | null;

export interface DrawerFieldProps {
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
}
export function DrawerField(props: DrawerFieldProps): JSX.Element;
