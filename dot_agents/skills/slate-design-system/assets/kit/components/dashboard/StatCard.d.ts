import type { ReactNode } from 'react';

export interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: boolean;
  className?: string;
}
export function Sparkline(props: SparklineProps): JSX.Element | null;

export interface StatDelta {
  /** Numeric change; sign picks direction if `direction` omitted. */
  value?: number;
  /** Force the arrow/color. */
  direction?: 'up' | 'down';
  /** Override the rendered text (defaults to `±value%`). */
  label?: ReactNode;
}
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  value?: ReactNode;
  delta?: StatDelta;
  /** Muted text after the delta. */
  deltaSuffix?: ReactNode;
  sparkline?: number[];
  icon?: string;
}
export function StatCard(props: StatCardProps): JSX.Element;
