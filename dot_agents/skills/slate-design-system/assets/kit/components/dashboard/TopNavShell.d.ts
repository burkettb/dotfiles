import type { ReactNode } from 'react';
import type { NavEntry } from './DashboardShell';

export interface TopNavShellProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: ReactNode;
  nav?: NavEntry[];
  /** Right side of the bar: buttons, search. */
  actions?: ReactNode;
  /** Rightmost slot, typically a UserMenu. */
  user?: ReactNode;
  onNavigate?: (item: NavEntry) => void;
  /** Full-width content instead of the centered container. */
  wide?: boolean;
  children?: ReactNode;
}
export function TopNavShell(props: TopNavShellProps): JSX.Element;
