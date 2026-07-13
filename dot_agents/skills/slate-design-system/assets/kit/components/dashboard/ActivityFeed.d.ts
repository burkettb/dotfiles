import type { ReactNode } from 'react';

export interface ActivityItem {
  id?: string | number;
  /** Bold actor name prefixed to the title. */
  actor?: ReactNode;
  title?: ReactNode;
  time?: ReactNode;
  body?: ReactNode;
  /** Marker glyph (Heroicons key). */
  icon?: string;
  /** Custom marker content (e.g. an <Avatar>). Overrides icon. */
  avatar?: ReactNode;
  /** Marker color. */
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}
export interface ActivityFeedProps extends React.HTMLAttributes<HTMLOListElement> {
  items?: ActivityItem[];
}
export function ActivityFeed(props: ActivityFeedProps): JSX.Element;
