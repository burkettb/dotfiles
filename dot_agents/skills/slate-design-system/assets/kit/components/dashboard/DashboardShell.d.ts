import type { ReactNode } from 'react';

export interface NavEntry {
  key?: string;
  label?: string;
  icon?: string;
  href?: string;
  active?: boolean;
  badge?: string | number;
  /** Render as a muted section label instead of a link. */
  section?: string;
}
export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: ReactNode;
  nav?: NavEntry[];
  sidebarFooter?: ReactNode;
  topBar?: ReactNode;
  /** Controlled collapse. Omit to let the shell manage it. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onNavigate?: (item: NavEntry) => void;
  children?: ReactNode;
}
export function DashboardShell(props: AppShellProps): JSX.Element;

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  breadcrumbs?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  user?: ReactNode;
}
export function TopBar(props: TopBarProps): JSX.Element;

/* Breadcrumbs moved to components/navigation/Breadcrumbs.d.ts (shared primitive). */

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: number | string;
}
export function SearchField(props: SearchFieldProps): JSX.Element;

export interface UserMenuItem { label?: string; icon?: string; danger?: boolean; divider?: boolean; }
export interface UserMenuProps {
  name?: string;
  email?: string;
  avatar?: ReactNode;
  items?: UserMenuItem[];
  onSelect?: (item: UserMenuItem) => void;
  className?: string;
}
export function UserMenu(props: UserMenuProps): JSX.Element;
