import React from 'react';
import styles from './Input.module.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}) {
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>

      <input {...props} className={styles.input} />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  error,
  className,
  children,
  ...props
}) {
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label}>
        {label}
        {hint && <span className={styles.hint}>{hint}</span>}
      </label>

      <select {...props} className={styles.select}>
        {children}
      </select>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}