import React from 'react';
import { Tag } from '../core/Tag.jsx';
import { Avatar } from '../core/Avatar.jsx';

/**
 * BlogCard — a post teaser: media slot, category tag, title, excerpt, author
 * + date. Compose in a grid for the blog index.
 */
export function BlogCard({ media, tag, tagHue = 'blue', title, excerpt, author, date, readTime, href = '#', onClick, className = '', ...rest }) {
  return (
    <article className={`sds-mk-blogcard ${className}`} {...rest}>
      {media && <a href={href} className="sds-mk-blogcard__media" onClick={onClick} tabIndex={-1} aria-hidden="true">{media}</a>}
      <div className="sds-mk-blogcard__body">
        <div className="sds-mk-blogcard__meta-top">
          {tag && <Tag hue={tagHue}>{tag}</Tag>}
          {readTime && <span className="sds-mk-blogcard__readtime">{readTime}</span>}
        </div>
        <h3 className="sds-mk-blogcard__title"><a href={href} onClick={onClick}>{title}</a></h3>
        {excerpt && <p className="sds-mk-blogcard__excerpt">{excerpt}</p>}
        {(author || date) && (
          <div className="sds-mk-blogcard__byline">
            {author && <Avatar name={author} size="xs" />}
            {author && <span className="sds-mk-blogcard__author">{author}</span>}
            {date && <span className="sds-mk-blogcard__date">{date}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * ArticleLayout — the reading page: centered measure (70ch), title block with
 * meta, and prose styling for the body children (plain h2/h3/p/ul/blockquote).
 */
export function ArticleLayout({ eyebrow, title, lead, author, role, date, readTime, hero, children, className = '', ...rest }) {
  return (
    <article className={`sds-mk-article ${className}`} {...rest}>
      <header className="sds-mk-article__head">
        {eyebrow && <p className="sds-mk-eyebrow">{eyebrow}</p>}
        <h1 className="sds-mk-article__title">{title}</h1>
        {lead && <p className="sds-mk-article__lead">{lead}</p>}
        <div className="sds-mk-article__meta">
          {author && <Avatar name={author} size="sm" />}
          <div className="sds-mk-article__metaText">
            {author && <span className="sds-mk-article__author">{author}{role ? ` · ${role}` : ''}</span>}
            {(date || readTime) && <span className="sds-mk-article__date">{[date, readTime].filter(Boolean).join(' · ')}</span>}
          </div>
        </div>
      </header>
      {hero && <div className="sds-mk-article__hero">{hero}</div>}
      <div className="sds-mk-article__prose">{children}</div>
    </article>
  );
}
