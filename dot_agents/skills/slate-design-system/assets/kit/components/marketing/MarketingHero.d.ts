import type { ReactNode } from 'react';

export interface MarketingHeroProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'centered' | 'split';
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  onPrimary?: () => void;
  onSecondary?: () => void;
  /** Small muted line under the CTAs, e.g. "Free 14-day trial". */
  note?: ReactNode;
  /** Screenshot / visual slot (use ImagePlaceholder until real art exists). */
  media?: ReactNode;
}
export function MarketingHero(props: MarketingHeroProps): JSX.Element;
