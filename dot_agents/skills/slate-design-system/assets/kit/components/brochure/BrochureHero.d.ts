import type { ReactNode } from 'react';

export interface BrochureHeroProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  /** Display string, e.g. "(415) 555-0119". Rendered as a tel: link. */
  phone?: string;
  phoneNote?: ReactNode;
  cta?: ReactNode;
  onCta?: () => void;
  media?: ReactNode;
  /** Trust badges row under the actions (e.g. a TrustStrip). */
  badges?: ReactNode;
}
export function BrochureHero(props: BrochureHeroProps): JSX.Element;
