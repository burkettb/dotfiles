import type { ReactNode } from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Heroicons key for the muted glyph. `false`/'' to omit. */
  icon?: string;
  title?: string;
  /** One specific sentence — say what will appear here. */
  description?: string;
  /** Primary action (typically one Button). */
  action?: ReactNode;
  size?: 'sm' | 'md';
  children?: ReactNode;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
