import { ReactElement } from 'react';
import { CSSProperties } from 'styled-components';

type Props = {
  size?: 'sm' | 'lg';
  height?: number;
};

export const Spinner = ({ size, height }: Props): ReactElement => {
  let className = 'spinner-border';
  if (size === 'sm') {
    className += ' spinner-border-sm';
  } else if (size === 'lg') {
    className += ' spinner-border-lg';
  }
  const style: CSSProperties = {};
  if (typeof height !== 'undefined') {
    style.width = height;
    style.height = height;
  }
  return (
    <div className={className} style={style} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};
