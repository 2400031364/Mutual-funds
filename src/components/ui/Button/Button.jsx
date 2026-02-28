import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        className
      )}
    />
  );
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <Link
      to={to}
      {...props}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
    />
  );
}