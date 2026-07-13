import React from 'react';
import { ImagePlaceholder } from '../core/ImagePlaceholder.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { Tag } from '../core/Tag.jsx';

/**
 * BeforeAfterGallery — paired project shots. Each item renders a Before and
 * After frame side by side with a caption. Uses ImagePlaceholder until real
 * photos are supplied (pass `before`/`after` nodes to override).
 */
export function BeforeAfterGallery({ items = [], columns = 2, className = '', ...rest }) {
  return (
    <div className={`sds-br-ba ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((it) => (
        <figure className="sds-br-ba__item" key={it.caption}>
          <div className="sds-br-ba__pair">
            <div className="sds-br-ba__frame">
              <span className="sds-br-ba__tag">Before</span>
              {it.before || <ImagePlaceholder label={`before photo — ${it.caption}`} ratio="4/3" radius="0" />}
            </div>
            <div className="sds-br-ba__frame">
              <span className="sds-br-ba__tag sds-br-ba__tag--after">After</span>
              {it.after || <ImagePlaceholder label={`after photo — ${it.caption}`} ratio="4/3" radius="0" />}
            </div>
          </div>
          <figcaption className="sds-br-ba__caption">{it.caption}{it.meta && <span className="sds-br-ba__meta"> · {it.meta}</span>}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * TeamCards — the people behind the business. Photo (or initials), name,
 * role, and one human line.
 */
export function TeamCards({ items = [], columns = 3, className = '', ...rest }) {
  return (
    <div className={`sds-br-team ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} {...rest}>
      {items.map((m) => (
        <div className="sds-br-member" key={m.name}>
          {m.photo || <Avatar name={m.name} size="xl" src={m.src} />}
          <div className="sds-br-member__name">{m.name}</div>
          <div className="sds-br-member__role">{m.role}</div>
          {m.note && <p className="sds-br-member__note">{m.note}</p>}
          {m.tags && <div className="sds-br-member__tags">{m.tags.map((t) => <Tag key={t} hue="teal">{t}</Tag>)}</div>}
        </div>
      ))}
    </div>
  );
}
