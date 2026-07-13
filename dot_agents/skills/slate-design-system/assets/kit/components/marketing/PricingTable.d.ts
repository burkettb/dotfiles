import type { ReactNode } from 'react';

export interface PricingTier {
  name: string;
  desc?: ReactNode;
  /** { monthly, annual } (annual = per-month price billed yearly) or a fixed string like "Custom". */
  price: { monthly: number; annual: number } | string;
  highlighted?: boolean;
  badge?: ReactNode;
  cta?: ReactNode;
  onSelect?: () => void;
  features?: string[];
}
export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: PricingTier[];
  defaultAnnual?: boolean;
  annualNote?: ReactNode;
}
export function PricingTable(props: PricingTableProps): JSX.Element;
