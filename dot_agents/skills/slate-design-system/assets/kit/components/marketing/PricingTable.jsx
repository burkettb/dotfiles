import React from 'react';
import { Button } from '../core/Button.jsx';
import { Badge } from '../core/Badge.jsx';
import { Icon } from '../core/Icon.jsx';

/**
 * PricingTable — tiered pricing with one highlighted tier and a monthly/annual
 * toggle. Tier prices: pass { monthly, annual } numbers (annual shown per
 * month, billed yearly) or a fixed `price` string (e.g. "Custom").
 */
export function PricingTable({ tiers = [], defaultAnnual = true, annualNote = 'Save 20% with annual billing', className = '', ...rest }) {
  const [annual, setAnnual] = React.useState(defaultAnnual);
  return (
    <div className={`sds-mk-pricing ${className}`} {...rest}>
      <div className="sds-mk-pricing__toggle" role="group" aria-label="Billing period">
        <button type="button" className={`sds-mk-pricing__period ${!annual ? 'sds-mk-pricing__period--on' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
        <button type="button" className={`sds-mk-pricing__period ${annual ? 'sds-mk-pricing__period--on' : ''}`} onClick={() => setAnnual(true)}>Annual</button>
        {annualNote && <span className="sds-mk-pricing__note">{annualNote}</span>}
      </div>
      <div className="sds-mk-pricing__grid" style={{ gridTemplateColumns: `repeat(${tiers.length}, 1fr)` }}>
        {tiers.map((t) => {
          const price = typeof t.price === 'string' ? t.price : annual ? t.price.annual : t.price.monthly;
          const cadence = typeof t.price === 'string' ? '' : '/mo';
          return (
            <div className={`sds-mk-tier ${t.highlighted ? 'sds-mk-tier--hi' : ''}`} key={t.name}>
              {t.highlighted && <div className="sds-mk-tier__flag">Most Popular</div>}
              <div className="sds-mk-tier__head">
                <h3 className="sds-mk-tier__name">{t.name}</h3>
                {t.badge && <Badge tone="info">{t.badge}</Badge>}
              </div>
              {t.desc && <p className="sds-mk-tier__desc">{t.desc}</p>}
              <div className="sds-mk-tier__price">
                <span className="sds-mk-tier__amount">{typeof price === 'number' ? `$${price}` : price}</span>
                {cadence && <span className="sds-mk-tier__cadence">{cadence}{annual ? ', billed yearly' : ''}</span>}
              </div>
              <Button variant={t.highlighted ? 'primary' : 'secondary'} fullWidth onClick={t.onSelect}>{t.cta || 'Get Started'}</Button>
              {t.features && (
                <ul className="sds-mk-tier__features">
                  {t.features.map((f) => <li key={f}><Icon name="check" size={15} className="sds-mk-tier__check" />{f}</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
