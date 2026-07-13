import type { ReactNode } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone — hue lives in the round dot; `danger` also reddens the text. */
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  /** The status dot (on by default — it carries the hue). */
  dot?: boolean;
  /** Hairline chip container for dense contexts; default is containerless. */
  boxed?: boolean;
  children?: ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
