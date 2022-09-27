import type { CSSProperties, FC } from 'react';

type Props = {
  size?: 'sm' | 'lg';
  height?: number;
};

export const Spinner: FC<Props> = ({ size, height }) => {
  let className = 'spinner-border';
  if (size === 'sm') {
    className += ' spinner-border-sm';
  } else if (size === 'lg') {
    className += ' spinner-border-lg';
  }
  const style: CSSProperties = {
    lineHeight: '16px',
  };
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
