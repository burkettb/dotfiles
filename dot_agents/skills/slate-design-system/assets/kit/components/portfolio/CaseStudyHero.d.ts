import type { ReactNode } from 'react';

export interface CaseStudyFact { label: string; value: ReactNode; }
export interface CaseStudyHeroProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  summary?: ReactNode;
  /** Role / Timeline / Outcome facts. */
  facts?: CaseStudyFact[];
  cover?: ReactNode;
}
export function CaseStudyHero(props: CaseStudyHeroProps): JSX.Element;

export interface CaseStudySectionProps extends React.HTMLAttributes<HTMLElement> {
  kind?: 'problem' | 'solution' | 'outcome';
  /** Rail marker, e.g. "01". */
  index?: ReactNode;
  title?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
}
export function CaseStudySection(props: CaseStudySectionProps): JSX.Element;

export interface GalleryItem { label: string; caption?: ReactNode; media?: ReactNode; }
export interface GalleryLightboxProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: GalleryItem[];
  columns?: number;
}
export function GalleryLightbox(props: GalleryLightboxProps): JSX.Element;
