import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TONE_ICON = { neutral: null, info: 'bell-alert', success: 'check-circle', warning: 'bell-alert', danger: 'bell-alert' };

/**
 * Toast — a transient, floating confirmation. Presentational: renders one
 * notification card (soft popover shadow, since it genuinely floats). Compose
 * inside <ToastViewport> and drive with the useToasts() hook, or render
 * directly for static demos.
 */
export function Toast({ tone = 'neutral', title, onDismiss, className = '', children, ...rest }) {
  const glyph = TONE_ICON[tone];
  return (
    <div className={`sds-toast sds-toast--${tone} ${className}`} role="status" {...rest}>
      {glyph && <Icon name={glyph} size={18} className="sds-toast__icon" />}
      <div className="sds-toast__content">
        {title && <p className="sds-toast__title">{title}</p>}
        {children && <p className="sds-toast__body">{children}</p>}
      </div>
      {onDismiss && (
        <button type="button" className="sds-toast__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="x-mark" size={16} />
        </button>
      )}
    </div>
  );
}

/** ToastViewport — fixed bottom-right stack. Place once near the app root. */
export function ToastViewport({ position = 'bottom-right', className = '', children, ...rest }) {
  return (
    <div className={`sds-toast-viewport sds-toast-viewport--${position} ${className}`} {...rest}>
      {children}
    </div>
  );
}

const ToastCtx = React.createContext(null);

/** ToastProvider — wraps the app, mounts a viewport, and exposes useToasts(). */
export function ToastProvider({ position = 'bottom-right', duration = 4000, children }) {
  const [toasts, setToasts] = React.useState([]);
  const dismiss = React.useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = React.useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, ...toast }]);
    if (duration) setTimeout(() => dismiss(id), toast.duration ?? duration);
    return id;
  }, [dismiss, duration]);
  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <ToastViewport position={position}>
        {toasts.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title} onDismiss={() => dismiss(t.id)}>{t.message}</Toast>
        ))}
      </ToastViewport>
    </ToastCtx.Provider>
  );
}

/** useToasts — returns { push, dismiss }. push({ tone, title, message }). */
export function useToasts() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error('useToasts must be used within <ToastProvider>');
  return ctx;
}
