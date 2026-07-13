import type { ReactNode } from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Categorical hue with a stable per-hue meaning. */
  /** Categorical hue — shown as the square swatch (shared with chart series). */
  hue?: 'blue' | 'teal' | 'violet' | 'amber' | 'rose';
  /** Hairline chip container (use for removable filter chips); default is containerless. */
  boxed?: boolean;
  /** When provided, renders a removable ✕ affordance. */
  onRemove?: (e: React.SyntheticEvent) => void;
  children?: ReactNode;
}
export function Tag(props: TagProps): JSX.Element;
