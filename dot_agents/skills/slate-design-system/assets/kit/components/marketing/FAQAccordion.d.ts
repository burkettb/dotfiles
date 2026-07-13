import type { ReactNode } from 'react';

export interface FAQItem { q: string; a: ReactNode; }
export interface FAQAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FAQItem[];
  /** Allow several open at once. */
  multiple?: boolean;
}
export function FAQAccordion(props: FAQAccordionProps): JSX.Element;

export interface StatItem { value: ReactNode; label: ReactNode; }
export interface StatsBandProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: StatItem[];
}
export function StatsBand(props: StatsBandProps): JSX.Element;
