import React from 'react';

/**
 * Card — a bordered content region. Structure from a 1px hairline border,
 * no shadow at rest. Compose Card.Header / Card.Body / Card.Footer, or pass
 * `title` / `description` for the common header shorthand.
 */
export function Card({ title, description, footer, children, className = '', ...rest }) {
  return (
    <div className={`sds-card ${className}`} {...rest}>
      {(title || description) && (
        <div className="sds-card__header">
          {title && <h3 className="sds-card__title">{title}</h3>}
          {description && <p className="sds-card__desc">{description}</p>}
        </div>
      )}
      <div className="sds-card__body">{children}</div>
      {footer && <div className="sds-card__footer">{footer}</div>}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', ...rest }) {
  return <div className={`sds-card__header ${className}`} {...rest}>{children}</div>;
};
Card.Body = function CardBody({ children, className = '', ...rest }) {
  return <div className={`sds-card__body ${className}`} {...rest}>{children}</div>;
};
Card.Footer = function CardFooter({ children, className = '', ...rest }) {
  return <div className={`sds-card__footer ${className}`} {...rest}>{children}</div>;
};
