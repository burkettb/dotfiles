import type { ReactNode } from 'react';

export interface TooltipProps {
  /** Tooltip text. */
  label: ReactNode;
  /** The single trigger element. */
  children: ReactNode;
  className?: string;
}
export function Tooltip(props: TooltipProps): JSX.Element;
