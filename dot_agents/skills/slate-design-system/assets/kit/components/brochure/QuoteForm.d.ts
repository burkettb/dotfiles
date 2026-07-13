import type { ReactNode } from 'react';

export interface QuoteFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Options for the service select (strings or { value, label }). */
  services?: (string | { value: string; label: string })[];
  title?: ReactNode;
  lead?: ReactNode;
  onSubmit?: (data: { service: string; timing: string; details: string; name: string; phone: string; address: string }) => void;
}
export function QuoteForm(props: QuoteFormProps): JSX.Element;

export interface StickyCallButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  phone?: string;
  label?: ReactNode;
}
export function StickyCallButton(props: StickyCallButtonProps): JSX.Element;
