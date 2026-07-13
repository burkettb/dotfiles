import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';

/**
 * AboutBio — the person block: big portrait slot (or initials), a display-size
 * intro line, and a short paragraph. Expressive scale, same tokens.
 */
export function AboutBio({ name, portrait, intro, children, className = '', ...rest }) {
  return (
    <section className={`sds-pf-bio ${className}`} {...rest}>
      <div className="sds-pf-bio__portrait">{portrait || <Avatar name={name} size="xl" />}</div>
      <div className="sds-pf-bio__copy">
        {intro && <p className="sds-pf-bio__intro">{intro}</p>}
        {children && <div className="sds-pf-bio__body">{children}</div>}
      </div>
    </section>
  );
}

/**
 * SkillsList — plain scannable groups, not meters. Never percentage bars.
 * Resist resume framing: "Now / Tools I Reach For / Off Hours" reads like a
 * person; "Design / Research / Build" reads like a CV. Lists of things you're
 * building, learning, and into beat lists of competencies.
 */
export function SkillsList({ groups = [], className = '', ...rest }) {
  return (
    <div className={`sds-pf-skills ${className}`} {...rest}>
      {groups.map((g) => (
        <div className="sds-pf-skills__group" key={g.label}>
          <h3 className="sds-pf-skills__label">{g.label}</h3>
          <ul className="sds-pf-skills__items">
            {g.items.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** ExperienceTimeline — roles down a hairline rail: period, title, place, one line. */
export function ExperienceTimeline({ items = [], className = '', ...rest }) {
  return (
    <ol className={`sds-pf-exp ${className}`} {...rest}>
      {items.map((e) => (
        <li className="sds-pf-exp__item" key={`${e.title}${e.period}`}>
          <span className="sds-pf-exp__period">{e.period}</span>
          <div className="sds-pf-exp__body">
            <span className="sds-pf-exp__role">{e.title}</span>
            {e.place && <span className="sds-pf-exp__place">{e.place}</span>}
            {e.note && <p className="sds-pf-exp__note">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * ContactSection — the closing ask: one display-size line, an email that IS
 * the link, and quiet secondary links (no contact form theater).
 */
export function ContactSection({ title = 'Let’s work together.', email, links = [], note, className = '', ...rest }) {
  return (
    <section className={`sds-pf-contact ${className}`} {...rest}>
      <h2 className="sds-pf-contact__title">{title}</h2>
      {email && <a className="sds-pf-contact__email" href={`mailto:${email}`}>{email}<Icon name="arrow-up-right" size={22} className="sds-pf-contact__arrow" /></a>}
      {links.length > 0 && (
        <div className="sds-pf-contact__links">
          {links.map((l) => <a key={l.label} href={l.href || '#'}>{l.label}</a>)}
        </div>
      )}
      {note && <p className="sds-pf-contact__note">{note}</p>}
    </section>
  );
}
