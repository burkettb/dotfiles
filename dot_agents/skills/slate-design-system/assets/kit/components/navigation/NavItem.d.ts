import type { ReactNode } from 'react';

export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Heroicons solid icon name (optional). */
  icon?: string;
  active?: boolean;
  /** Renders as an <a> when provided. */
  href?: string;
  children?: ReactNode;
}
export function NavItem(props: NavItemProps): JSX.Element;
