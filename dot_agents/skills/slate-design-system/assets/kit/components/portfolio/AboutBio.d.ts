import type { ReactNode } from 'react';

export interface AboutBioProps extends React.HTMLAttributes<HTMLElement> {
  name?: string;
  portrait?: ReactNode;
  /** Display-size intro line. */
  intro?: ReactNode;
  children?: ReactNode;
}
export function AboutBio(props: AboutBioProps): JSX.Element;

export interface SkillGroup { label: string; items: string[]; }
export interface SkillsListProps extends React.HTMLAttributes<HTMLDivElement> {
  groups?: SkillGroup[];
}
export function SkillsList(props: SkillsListProps): JSX.Element;

export interface ExperienceItem { period: string; title: ReactNode; place?: ReactNode; note?: ReactNode; }
export interface ExperienceTimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items?: ExperienceItem[];
}
export function ExperienceTimeline(props: ExperienceTimelineProps): JSX.Element;

export interface ContactLink { label: string; href?: string; }
export interface ContactSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  email?: string;
  links?: ContactLink[];
  note?: ReactNode;
}
export function ContactSection(props: ContactSectionProps): JSX.Element;
