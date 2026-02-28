import React from 'react';
import styles from './Table.module.css';

export function TableWrap({ children }) {
  return <div className={styles.wrap}>{children}</div>;
}

export const tableStyles = styles;