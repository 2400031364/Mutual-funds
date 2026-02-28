import React from 'react';
import styles from './Card.module.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Card({
  className,
  padded = true,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={cx(
        styles.card,
        padded && styles.padded,
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}) {
  return (
    <div className={styles.header}>
      <div>
        <h3>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}

export function CardBody({ children }) {
  return <div>{children}</div>;
}