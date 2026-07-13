import type { ReactNode } from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Centered label between two hairlines (e.g. "or"). */
  label?: ReactNode;
}
export function Divider(props: DividerProps): JSX.Element;
