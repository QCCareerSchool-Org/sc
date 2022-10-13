import type { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const BlankLayout: FC<Props> = ({ children }) => <div>{children}</div>;
