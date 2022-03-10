import type { ReactElement, ReactNode } from 'react';

import { AuthStateProvider } from './AuthStateProvider';
import { NavStateProvider } from './NavStateProvider';
import { ScreenWidthProvider } from './ScreenWidthProvider';

type Props = {
  children: ReactNode;
};

export const StateProvider = ({ children }: Props): ReactElement => (
  <AuthStateProvider>
    <NavStateProvider>
      <ScreenWidthProvider>
        {children}
      </ScreenWidthProvider>
    </NavStateProvider>
  </AuthStateProvider>
);
