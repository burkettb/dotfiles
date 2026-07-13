import type { ReactNode } from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone — hue encodes the meaning. */
  tone?: 'info' | 'success' | 'warning' | 'danger';
  /** Bold first line. */
  title?: string;
  /** Icon name (Heroicons key) or `false` to hide. Defaults per tone. */
  icon?: string | false;
  /** Renders a dismiss button when provided. */
  onDismiss?: () => void;
  /** Right/bottom action row (e.g. links or ghost buttons). */
  actions?: ReactNode;
  children?: ReactNode;
}
export function Alert(props: AlertProps): JSX.Element;
