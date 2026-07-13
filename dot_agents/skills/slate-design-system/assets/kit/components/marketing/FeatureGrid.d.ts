import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;

export interface FeatureItem { icon?: string; title: ReactNode; body?: ReactNode; }
export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FeatureItem[];
  columns?: number;
}
export function FeatureGrid(props: FeatureGridProps): JSX.Element;

export interface FeatureRowItem { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; bullets?: string[]; media?: ReactNode; }
export interface FeatureRowsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FeatureRowItem[];
}
export function FeatureRows(props: FeatureRowsProps): JSX.Element;

export interface BentoItem { icon?: string; title: ReactNode; body?: ReactNode; media?: ReactNode; /** Columns of 6 to span. */ span?: number; rows?: number; }
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: BentoItem[];
}
export function BentoGrid(props: BentoGridProps): JSX.Element;
