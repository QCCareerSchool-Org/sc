import type { FC, ReactNode } from 'react';
import { AdminServicesProvider } from './AdminServicesProvider';

import { AuthStateProvider } from './AuthStateProvider';
import { ModalProvider } from './ModalProvider';
import { NavStateProvider } from './NavStateProvider';
import { ScreenWidthProvider } from './ScreenWidthProvider';
import { ScrollbarWidthProvider } from './ScrollbarWidthProvider';
import { ServicesProvider } from './ServicesProvider';
import { StudentServicesProvider } from './StudentServicesProvider';
import { TutorServicesProvider } from './TutorServicesProvider';
import { UnitToggleStateProvider } from './UnitToggleStateProvider';

type Props = {
  children: ReactNode;
};

export const StateProvider: FC<Props> = ({ children }) => (
  <AuthStateProvider>
    <NavStateProvider>
      <UnitToggleStateProvider>
        <ScreenWidthProvider>
          <ServicesProvider>
            <AdminServicesProvider>
              <TutorServicesProvider>
                <StudentServicesProvider>
                  <ModalProvider>
                    <ScrollbarWidthProvider>
                      {children}
                    </ScrollbarWidthProvider>
                  </ModalProvider>
                </StudentServicesProvider>
              </TutorServicesProvider>
            </AdminServicesProvider>
          </ServicesProvider>
        </ScreenWidthProvider>
      </UnitToggleStateProvider>
    </NavStateProvider>
  </AuthStateProvider>
);
