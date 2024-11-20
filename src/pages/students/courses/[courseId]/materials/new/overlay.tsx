import type { FC } from 'react';

import styles from './overlay.module.scss';
import { Spinner } from '@/components/Spinner';

export const Overlay: FC = () => (
  <div className={styles.overlay}>
    <div className={styles.spinnerWrapper}>
      <Spinner />
    </div>
  </div>
);
