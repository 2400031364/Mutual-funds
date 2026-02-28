import React from 'react';
import styles from './Badge.module.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Badge({ tone = 'neutral', children, className, ...props }) {
  return (
    <span className={cx(styles.badge, styles[tone], className)} {...props}>
      {children}
    </span>
  );
}