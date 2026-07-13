import type { ReactNode } from 'react';

export interface CopyButtonProps {
  /** Text to copy, or a function returning it. */
  value: string | (() => string);
  label?: ReactNode;
  copiedLabel?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}
export function CopyButton(props: CopyButtonProps): JSX.Element;

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Code string (preferred — enables copy). */
  code?: string;
  children?: ReactNode;
  wrap?: boolean;
  copyable?: boolean;
  /** Bar label, e.g. "JSON". */
  label?: ReactNode;
}
export function CodeBlock(props: CodeBlockProps): JSX.Element;

export interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  value?: ReactNode;
  detail?: ReactNode;
  actions?: ReactNode;
}
export function ResultCard(props: ResultCardProps): JSX.Element;

export interface ShareExportItem { label: string; icon?: string; onClick?: () => void; }
export interface ShareExportRowProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ShareExportItem[];
}
export function ShareExportRow(props: ShareExportRowProps): JSX.Element;
