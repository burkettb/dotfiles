import type { ReactElement, ReactNode } from 'react';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The element that toggles the popover. */
  trigger: ReactElement;
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right';
  /** Controlled open state. Omit to let the popover manage it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
export function Popover(props: PopoverProps): JSX.Element;
