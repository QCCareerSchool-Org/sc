import type { FC, ReactNode } from 'react';

type Props = {
  complete: boolean;
  children: ReactNode;
};

export const LessonBorder: FC<Props> = ({ complete, children }) => (
  <div className="container" style={complete ? { backgroundColor: 'rgb(232, 255, 239)' } : {}}>
    {children}
  </div>
);
