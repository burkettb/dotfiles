import type { ReactNode } from 'react';

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  title?: string;
  onDismiss?: () => void;
  children?: ReactNode;
}
export function Toast(props: ToastProps): JSX.Element;

export interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  children?: ReactNode;
}
export function ToastViewport(props: ToastViewportProps): JSX.Element;

export interface ToastProviderProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Auto-dismiss delay in ms (0 to disable). */
  duration?: number;
  children?: ReactNode;
}
export function ToastProvider(props: ToastProviderProps): JSX.Element;

export interface ToastInput { tone?: ToastTone; title?: string; message?: ReactNode; duration?: number; }
export function useToasts(): { push: (t: ToastInput) => string; dismiss: (id: string) => void };
