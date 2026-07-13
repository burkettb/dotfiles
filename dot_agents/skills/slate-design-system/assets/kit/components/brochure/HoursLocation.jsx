import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { ImagePlaceholder } from '../core/ImagePlaceholder.jsx';

/**
 * HoursLocation — hours table + address block side by side with a map slot.
 * `hours` rows highlight today automatically when `highlightToday` is set.
 */
export function HoursLocation({ hours = [], address, phone, email, map, highlightToday = true, className = '', ...rest }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const tel = phone ? 'tel:' + String(phone).replace(/[^+\d]/g, '') : undefined;
  return (
    <div className={`sds-br-hoursloc ${className}`} {...rest}>
      <div className="sds-br-hoursloc__info">
        <div className="sds-br-hoursloc__block">
          <h3 className="sds-br-hoursloc__h"><Icon name="clock" size={16} /> Hours</h3>
          <table className="sds-br-hours">
            <tbody>
              {hours.map((h) => (
                <tr key={h.day} className={highlightToday && h.day === today ? 'sds-br-hours__today' : ''}>
                  <td>{h.day}</td><td>{h.open || 'Closed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sds-br-hoursloc__block">
          <h3 className="sds-br-hoursloc__h"><Icon name="map-pin" size={16} /> Location</h3>
          {address && <address className="sds-br-hoursloc__addr">{address}</address>}
          {phone && <a className="sds-br-hoursloc__line" href={tel}><Icon name="phone" size={14} /> {phone}</a>}
          {email && <a className="sds-br-hoursloc__line" href={`mailto:${email}`}><Icon name="envelope" size={14} /> {email}</a>}
        </div>
      </div>
      <div className="sds-br-hoursloc__map">{map || <ImagePlaceholder label="map embed" height="100%" />}</div>
    </div>
  );
}

/**
 * ServiceArea — coverage block that reads as geography at a glance: a map
 * slot with a service-radius ring beside the header, and the towns as real
 * prose text (crawlable — good for local SEO), not chips.
 * Pass `map` (real embed) to replace the built-in placeholder.
 */
export function ServiceArea({ title = 'Areas We Serve', lead, areas = [], note, map, radiusLabel, className = '', ...rest }) {
  return (
    <div className={`sds-br-area ${className}`} {...rest}>
      <div className="sds-br-area__info">
        <h3 className="sds-br-area__title"><Icon name="map-pin" size={16} className="sds-br-area__pin" /> {title}</h3>
        {lead && <p className="sds-br-area__lead">{lead}</p>}
        {areas.length > 0 && (
          <p className="sds-br-area__towns">
            {areas.map((a, i) => (
              <React.Fragment key={a}>
                <strong>{a}</strong>
                {i < areas.length - 1 && <span aria-hidden="true"> · </span>}
              </React.Fragment>
            ))}
          </p>
        )}
        {note && <p className="sds-br-area__note">{note}</p>}
      </div>
      <div className="sds-br-area__mapwrap">
        {map || (
          <div className="sds-br-area__map-ph">
            <span className="sds-br-area__ring" aria-hidden="true" />
            <span className="sds-br-area__ringdot" aria-hidden="true" />
            {radiusLabel && <span className="sds-br-area__ringlabel">{radiusLabel}</span>}
            <span className="sds-br-area__phlabel">map embed</span>
          </div>
        )}
      </div>
    </div>
  );
}
