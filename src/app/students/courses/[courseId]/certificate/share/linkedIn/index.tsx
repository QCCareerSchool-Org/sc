'use client';

import type { FC, MouseEventHandler } from 'react';

import globalStyles from '../global.module.css';
import styles from './index.module.css';

interface Props {
  url: string;
  text: string;
}

export const LinkedInShare: FC<Props> = ({ url, text }) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const href = target.href;
    window.open(href, 'Share on LinkedIn', 'width=640, height=536');
  };

  return <a onClick={handleClick} href={`http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&summary=${encodeURI(text)}`} target="_blank" rel="noreferrer" className={`${globalStyles.button} ${styles.button}`}>Share on LinkedIn</a>;
};
