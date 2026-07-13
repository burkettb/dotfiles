import type { ReactNode } from 'react';

export interface ToolShellProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: ReactNode;
  /** One line. What it does, not why it's great. */
  description?: ReactNode;
  badge?: ReactNode;
  maxWidth?: number | string;
  footer?: ReactNode;
  children?: ReactNode;
}
export function ToolShell(props: ToolShellProps): JSX.Element;

export interface ToolPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** grid-template-columns for desktop, e.g. "1fr 1fr". */
  ratio?: string;
  children?: ReactNode;
}
export function ToolPanels(props: ToolPanelsProps): JSX.Element;

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}
export function InputPanel(props: PanelProps): JSX.Element;
export function OutputPanel(props: PanelProps): JSX.Element;
