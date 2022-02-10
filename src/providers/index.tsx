import { ReactElement, ReactNode } from 'react';

import { AuthStateProvider } from './AuthStateProvider';
import { ScreenWidthProvider } from './ScreenWidthProvider';

type Props = {
  children: ReactNode;
};

const StateProvider = ({ children }: Props): ReactElement => (
  <AuthStateProvider>
    <ScreenWidthProvider>
      {children}
    </ScreenWidthProvider>
  </AuthStateProvider>
);

export default StateProvider;
