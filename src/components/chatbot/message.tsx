import type { FC } from 'react';

import styles from './message.module.css';

interface Props {
  text: string;
  type: 'user' | 'bot';
}

export const Message: FC<Props> = ({ text, type }) => (
  <div className={`${styles.message} ${type === 'user' ? styles.user : styles.bot}`}>{text}</div>
);
