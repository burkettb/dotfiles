import type { ReactNode } from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  /** Label shown above the track. */
  label?: ReactNode;
  /** Show the percentage on the right of the label row. */
  showValue?: boolean;
  /** Bar color; default is the accent. */
  tone?: 'success' | 'danger';
}
export function Progress(props: ProgressProps): JSX.Element;
