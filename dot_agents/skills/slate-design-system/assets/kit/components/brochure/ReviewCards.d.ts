import type { ReactNode } from 'react';

export interface ReviewStarsProps {
  rating?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}
export function ReviewStars(props: ReviewStarsProps): JSX.Element;

export interface ReviewItem { quote: string; name: string; rating?: number; /** e.g. "Google" */ source?: ReactNode; /** e.g. "Roof replacement · Maplewood" */ meta?: ReactNode; }
export interface ReviewCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ReviewItem[];
  columns?: number;
}
export function ReviewCards(props: ReviewCardsProps): JSX.Element;
