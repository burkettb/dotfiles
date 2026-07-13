import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

/**
 * BrochureHero — local-business opener: headline, one supporting line, a
 * prominent phone number, and a quote/booking CTA. The phone number is a real
 * tel: link and reads as large as the CTA — many customers just want to call.
 */
export function BrochureHero({ eyebrow, title, lead, phone, phoneNote = 'Call or text — free estimates', cta = 'Request a Quote', onCta, media, badges, className = '', ...rest }) {
  const tel = phone ? 'tel:' + String(phone).replace(/[^+\d]/g, '') : undefined;
  return (
    <section className={`sds-br-hero ${className}`} {...rest}>
      <div className="sds-br-hero__copy">
        {eyebrow && <p className="sds-br-eyebrow">{eyebrow}</p>}
        <h1 className="sds-br-hero__title">{title}</h1>
        {lead && <p className="sds-br-hero__lead">{lead}</p>}
        <div className="sds-br-hero__actions">
          <Button variant="primary" size="lg" onClick={onCta}>{cta}</Button>
          {phone && (
            <a className="sds-br-hero__phone" href={tel}>
              <Icon name="phone" size={20} />
              <span className="sds-br-hero__phone-num">{phone}</span>
            </a>
          )}
        </div>
        {phone && phoneNote && <p className="sds-br-hero__phonenote">{phoneNote}</p>}
        {badges && <div className="sds-br-hero__badges">{badges}</div>}
      </div>
      {media && <div className="sds-br-hero__media">{media}</div>}
    </section>
  );
}
