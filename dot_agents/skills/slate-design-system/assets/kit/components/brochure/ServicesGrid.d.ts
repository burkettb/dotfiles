import type { ReactNode } from 'react';

export interface ServiceItem { icon?: string; title: ReactNode; body?: ReactNode; href?: string; onClick?: (s: ServiceItem) => void; }
export interface ServicesGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ServiceItem[];
  columns?: number;
}
export function ServicesGrid(props: ServicesGridProps): JSX.Element;

export interface TrustItem { icon?: string; stars?: number; label: ReactNode; }
export interface TrustStripProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Explicit items; overrides the years/licensed/rating shorthand. */
  items?: TrustItem[];
  years?: number;
  licensed?: boolean;
  rating?: number;
  reviewCount?: number;
  source?: string;
}
export function TrustStrip(props: TrustStripProps): JSX.Element;
