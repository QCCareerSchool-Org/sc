import type { ReactElement, ReactNode } from 'react';
import { AdminServicesProvider } from './AdminServicesProvider';

import { AuthStateProvider } from './AuthStateProvider';
import { NavStateProvider } from './NavStateProvider';
import { ScreenWidthProvider } from './ScreenWidthProvider';
import { ServicesProvider } from './ServicesProvider';
import { StudentServicesProvider } from './StudentServicesProvider';

type Props = {
  children: ReactNode;
};

export const StateProvider = ({ children }: Props): ReactElement => (
  <AuthStateProvider>
    <NavStateProvider>
      <ScreenWidthProvider>
        <ServicesProvider>
          <AdminServicesProvider>
            <StudentServicesProvider>
              {children}
            </StudentServicesProvider>
          </AdminServicesProvider>
        </ServicesProvider>
      </ScreenWidthProvider>
    </NavStateProvider>
  </AuthStateProvider>
);
