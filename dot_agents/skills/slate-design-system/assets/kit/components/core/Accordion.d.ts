import type { ReactNode } from 'react';

export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
}
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: AccordionItem[];
  /** Index opened initially; -1 for all closed. */
  defaultOpen?: number;
  /** Allow several items open at once. */
  multiple?: boolean;
}
export function Accordion(props: AccordionProps): JSX.Element;
