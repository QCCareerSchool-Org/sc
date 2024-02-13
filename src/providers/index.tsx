import type { FC, PropsWithChildren } from 'react';

import { AdminServicesProvider } from './AdminServicesProvider';
import { AuditorServicesProvider } from './AuditorServicesProvider';
import { AuthStateProvider } from './AuthStateProvider';
import { ModalProvider } from './ModalProvider';
import { NavStateProvider } from './NavStateProvider';
import { ScreenWidthProvider } from './ScreenWidthProvider';
import { ScrollbarWidthProvider } from './ScrollbarWidthProvider';
import { ServicesProvider } from './ServicesProvider';
import { StudentServicesProvider } from './StudentServicesProvider';
import { TutorServicesProvider } from './TutorServicesProvider';
import { UnitToggleStateProvider } from './UnitToggleStateProvider';

export const StateProvider: FC<PropsWithChildren> = ({ children }) => (
  <AuthStateProvider>
    <NavStateProvider>
      <UnitToggleStateProvider>
        <ScreenWidthProvider>
          <ServicesProvider>
            <AdminServicesProvider>
              <TutorServicesProvider>
                <AuditorServicesProvider>
                  <StudentServicesProvider>
                    <ModalProvider>
                      <ScrollbarWidthProvider>
                        {children}
                      </ScrollbarWidthProvider>
                    </ModalProvider>
                  </StudentServicesProvider>
                </AuditorServicesProvider>
              </TutorServicesProvider>
            </AdminServicesProvider>
          </ServicesProvider>
        </ScreenWidthProvider>
      </UnitToggleStateProvider>
    </NavStateProvider>
  </AuthStateProvider>
);
