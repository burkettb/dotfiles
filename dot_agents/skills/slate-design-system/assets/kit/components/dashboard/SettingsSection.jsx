import React from 'react';

/**
 * SettingsSection — the sectioned settings pattern: a left rail (title +
 * description) and a right column holding the form controls, divided by a
 * hairline. Stack several down a settings page.
 */
export function SettingsSection({ title, description, footer, children, className = '', ...rest }) {
  return (
    <section className={`sds-settings-sec ${className}`} {...rest}>
      <div className="sds-settings-sec__aside">
        {title && <h3 className="sds-settings-sec__title">{title}</h3>}
        {description && <p className="sds-settings-sec__desc">{description}</p>}
      </div>
      <div className="sds-settings-sec__main">
        <div className="sds-settings-sec__fields">{children}</div>
        {footer && <div className="sds-settings-sec__footer">{footer}</div>}
      </div>
    </section>
  );
}

/**
 * DangerZone — a red-outlined region for irreversible actions. Each DangerRow
 * pairs an explanation with a single destructive button. Kept visually apart
 * from the rest of the settings so it can't be triggered by accident.
 */
export function DangerZone({ title = 'Danger Zone', children, className = '', ...rest }) {
  return (
    <section className={`sds-danger ${className}`} {...rest}>
      <div className="sds-danger__label">{title}</div>
      <div className="sds-danger__card">{children}</div>
    </section>
  );
}

export function DangerRow({ title, description, action, className = '' }) {
  return (
    <div className={`sds-danger__row ${className}`}>
      <div className="sds-danger__text">
        {title && <div className="sds-danger__row-title">{title}</div>}
        {description && <div className="sds-danger__row-desc">{description}</div>}
      </div>
      <div className="sds-danger__row-action">{action}</div>
    </div>
  );
}
