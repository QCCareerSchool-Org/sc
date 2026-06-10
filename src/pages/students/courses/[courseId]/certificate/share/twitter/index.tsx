'use client';

import type { FC, MouseEventHandler } from 'react';

import globalStyles from '../global.module.css';
import styles from './index.module.css';

interface Props {
  url: string;
  text: string;
}

export const TwitterShare: FC<Props> = ({ url, text }) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const href = target.href;
    window.open(href, 'Share on X', 'width=640, height=536');
  };

  return <a onClick={handleClick} href={`https://twitter.com/intent/tweet?url=${encodeURI(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className={`${globalStyles.button} ${styles.button}`}>Share on X</a>;
};
