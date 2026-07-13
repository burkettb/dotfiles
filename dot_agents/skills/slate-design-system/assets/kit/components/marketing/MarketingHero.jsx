import React from 'react';
import { Button } from '../core/Button.jsx';

/**
 * MarketingHero — the landing-page opener. `variant="centered"` stacks the
 * message over an optional media slot; `variant="split"` puts copy left and a
 * product screenshot right. Marketing mode breathes: display type + generous
 * whitespace, but the same tokens as everything else.
 */
export function MarketingHero({
  variant = 'centered',
  eyebrow,
  title,
  lead,
  primaryCta,
  secondaryCta,
  onPrimary,
  onSecondary,
  note,
  media,
  className = '',
  ...rest
}) {
  const copy = (
    <div className="sds-mk-hero__copy">
      {eyebrow && <p className="sds-mk-eyebrow">{eyebrow}</p>}
      <h1 className="sds-mk-hero__title">{title}</h1>
      {lead && <p className="sds-mk-hero__lead">{lead}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="sds-mk-hero__ctas">
          {primaryCta && <Button variant="primary" size="lg" onClick={onPrimary}>{primaryCta}</Button>}
          {secondaryCta && <Button variant="secondary" size="lg" onClick={onSecondary}>{secondaryCta}</Button>}
        </div>
      )}
      {note && <p className="sds-mk-hero__note">{note}</p>}
    </div>
  );
  return (
    <section className={`sds-mk-hero sds-mk-hero--${variant} ${className}`} {...rest}>
      {copy}
      {media && <div className="sds-mk-hero__media">{media}</div>}
    </section>
  );
}
