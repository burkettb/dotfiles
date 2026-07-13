export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shape preset. `text` + `lines` renders a stacked paragraph. */
  variant?: 'line' | 'text' | 'circle' | 'rect' | 'button';
  width?: number | string;
  height?: number | string;
  /** Number of lines when variant="text". */
  lines?: number;
  radius?: number | string;
}
export function Skeleton(props: SkeletonProps): JSX.Element;
