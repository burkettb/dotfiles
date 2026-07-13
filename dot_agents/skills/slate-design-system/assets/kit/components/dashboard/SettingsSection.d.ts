import type { ReactNode } from 'react';

export interface SettingsSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned action row under the fields (e.g. a Save button). */
  footer?: ReactNode;
  children?: ReactNode;
}
export function SettingsSection(props: SettingsSectionProps): JSX.Element;

export interface DangerZoneProps extends React.HTMLAttributes<HTMLElement> {
  title?: ReactNode;
  children?: ReactNode;
}
export function DangerZone(props: DangerZoneProps): JSX.Element;

export interface DangerRowProps {
  title?: ReactNode;
  description?: ReactNode;
  /** The destructive button. */
  action?: ReactNode;
  className?: string;
}
export function DangerRow(props: DangerRowProps): JSX.Element;
