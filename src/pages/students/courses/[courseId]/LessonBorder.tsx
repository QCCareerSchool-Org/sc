import type { CSSProperties, FC, ReactNode } from 'react';

type Props = {
  complete: boolean;
  last: boolean;
  children: ReactNode;
};

export const LessonBorder: FC<Props> = ({ complete, last, children }) => {
  const style: CSSProperties = last ? {} : { borderBottom: '0.5px solid #a1a1a1' };
  if (complete) {
    style.backgroundColor = 'rgb(232, 255, 239)';
  }
  return (
    <div className="container" style={style}>
      {children}
    </div>
  );
};
