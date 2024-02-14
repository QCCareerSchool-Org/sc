import type { FC, MouseEventHandler, PropsWithChildren } from 'react';

import styles from './badge.module.scss';

type Props = {
  title?: string;
  onClick?: MouseEventHandler;
};

export const Badge: FC<PropsWithChildren<Props>> = props => {
  return <span title={props.title} onClick={props.onClick} className={`${styles.badge} ${props.onClick ? styles.hover : ''} badge text-bg-secondary`}>{props.children}</span>;
};
