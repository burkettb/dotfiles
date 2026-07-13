import type { ReactNode } from 'react';

export interface BeforeAfterItem { caption: string; meta?: ReactNode; before?: ReactNode; after?: ReactNode; }
export interface BeforeAfterGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: BeforeAfterItem[];
  columns?: number;
}
export function BeforeAfterGallery(props: BeforeAfterGalleryProps): JSX.Element;

export interface TeamMember { name: string; role?: ReactNode; note?: ReactNode; src?: string; photo?: ReactNode; tags?: string[]; }
export interface TeamCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: TeamMember[];
  columns?: number;
}
export function TeamCards(props: TeamCardsProps): JSX.Element;
