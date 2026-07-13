import React from 'react';
import { Button } from '../core/Button.jsx';
import { Input } from '../forms/Input.jsx';

/**
 * CTABanner — the full-width closing ask on a dark slate surface (the one
 * sanctioned dark region). One title, one primary action.
 */
export function CTABanner({ title, lead, cta = 'Get Started', onCta, secondaryCta, onSecondary, className = '', ...rest }) {
  return (
    <section className={`sds-mk-cta ${className}`} {...rest}>
      <h2 className="sds-mk-cta__title">{title}</h2>
      {lead && <p className="sds-mk-cta__lead">{lead}</p>}
      <div className="sds-mk-cta__actions">
        <Button variant="primary" size="lg" onClick={onCta}>{cta}</Button>
        {secondaryCta && <button type="button" className="sds-mk-cta__secondary" onClick={onSecondary}>{secondaryCta}</button>}
      </div>
    </section>
  );
}

/**
 * NewsletterCapture — inline email capture: one field, one button, one line
 * of reassurance. Never more.
 */
export function NewsletterCapture({ title = 'Get product updates', lead, placeholder = 'you@company.com', cta = 'Subscribe', note, onSubmit, className = '', ...rest }) {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    setDone(true);
    onSubmit && onSubmit(email);
  };
  return (
    <div className={`sds-mk-newsletter ${className}`} {...rest}>
      <div className="sds-mk-newsletter__copy">
        <h3 className="sds-mk-newsletter__title">{title}</h3>
        {lead && <p className="sds-mk-newsletter__lead">{lead}</p>}
      </div>
      {done ? (
        <p className="sds-mk-newsletter__done">Check your inbox to confirm your subscription.</p>
      ) : (
        <form className="sds-mk-newsletter__form" onSubmit={submit}>
          <Input type="email" required placeholder={placeholder} value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
          <Button variant="primary" type="submit">{cta}</Button>
        </form>
      )}
      {note && !done && <p className="sds-mk-newsletter__note">{note}</p>}
    </div>
  );
}
