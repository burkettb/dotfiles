import type { ReactNode } from 'react';

export interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}
export function HowItWorks(props: HowItWorksProps): JSX.Element;

export interface RelatedTool { name: string; desc?: ReactNode; icon?: string; href?: string; }
export interface RelatedToolsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: RelatedTool[];
  columns?: number;
}
export function RelatedToolsGrid(props: RelatedToolsGridProps): JSX.Element;
