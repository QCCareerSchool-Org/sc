import type { FC } from 'react';
import Markdown from 'react-markdown';

import styles from './message.module.css';

interface Props {
  text: string;
  type: 'user' | 'bot' | 'system';
}

export const Message: FC<Props> = ({ text, type }) => (
  <div className={`${styles.message} ${styles[type]}`}>
    {type === 'bot'
      ? <Markdown>{text}</Markdown>
      : text}
  </div>
);
