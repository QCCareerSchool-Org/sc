import type { FC } from 'react';

import styles from './progress.module.css';

export const Progress: FC = () => {
  return (
    <div className={styles.progress} role="status" aria-live="polite">
      <span className={styles.label}>Assistant is typing</span>
      <span className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
};
