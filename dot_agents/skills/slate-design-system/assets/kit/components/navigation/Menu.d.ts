import type { ReactElement, ReactNode } from 'react';

export interface MenuItem {
  label?: string;
  icon?: string;
  danger?: boolean;
  /** Render a hairline divider instead of an item. */
  divider?: boolean;
  onSelect?: (item: MenuItem) => void;
}
export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The element that opens the menu (a Button, IconButton, …). */
  trigger: ReactElement;
  items?: MenuItem[];
  onSelect?: (item: MenuItem) => void;
  /** Which edge of the trigger the menu aligns to. */
  align?: 'left' | 'right';
  /** Optional header block above the items. */
  header?: ReactNode;
}
export function Menu(props: MenuProps): JSX.Element;
