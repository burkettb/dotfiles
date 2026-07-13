import type { ReactNode } from 'react';

export interface CTABannerProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  lead?: ReactNode;
  cta?: ReactNode;
  onCta?: () => void;
  /** Quiet text link next to the button. */
  secondaryCta?: ReactNode;
  onSecondary?: () => void;
}
export function CTABanner(props: CTABannerProps): JSX.Element;

export interface NewsletterCaptureProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  lead?: ReactNode;
  placeholder?: string;
  cta?: ReactNode;
  /** Reassurance line, e.g. "One email a month. Unsubscribe anytime." */
  note?: ReactNode;
  onSubmit?: (email: string) => void;
}
export function NewsletterCapture(props: NewsletterCaptureProps): JSX.Element;
