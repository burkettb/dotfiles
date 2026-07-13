import type { ReactNode } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials if absent or it fails to load. */
  src?: string;
  /** Full name — used for initials and the accessible label. */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Presence dot. */
  status?: 'online' | 'away' | 'busy' | 'offline';
}
export function Avatar(props: AvatarProps): JSX.Element;

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show at most this many, then a +N chip. */
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}
export function AvatarGroup(props: AvatarGroupProps): JSX.Element;
