import type { ReactNode } from 'react';

export interface Testimonial { quote: string; name: string; role?: string; avatar?: string; }
export interface TestimonialGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Testimonial[];
  columns?: number;
}
export function TestimonialGrid(props: TestimonialGridProps): JSX.Element;

export interface LogoWallItem { name: string; logo?: ReactNode; }
export interface LogoWallProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: (string | LogoWallItem)[];
  /** Muted line above, e.g. "Trusted by finance teams at". */
  label?: ReactNode;
}
export function LogoWall(props: LogoWallProps): JSX.Element;
