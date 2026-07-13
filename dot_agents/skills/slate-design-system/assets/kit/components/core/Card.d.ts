import type { ReactNode } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title shorthand. */
  title?: ReactNode;
  /** Header description shorthand (muted, under the title). */
  description?: ReactNode;
  /** Footer content (right-aligned actions). */
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * A bordered content region — hairline border, no shadow at rest.
 * @startingPoint section="Core" subtitle="Bordered content region with header, body & footer" viewport="700x260"
 */
export function Card(props: CardProps): JSX.Element & {
  Header: (p: React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
  Body: (p: React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
  Footer: (p: React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
};
