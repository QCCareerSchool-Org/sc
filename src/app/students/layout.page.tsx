'use client';
import type { FC, PropsWithChildren } from 'react';

import 'src/style.scss';
// import '@fontsource/great-vibes';
// import '@fontsource/cinzel';
import { AuthStateProvider } from '@/providers/AuthStateProvider';
import { ServicesProvider } from '@/providers/ServicesProvider';
import { StudentServicesProvider } from '@/providers/StudentServicesProvider';

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      <ServicesProvider>
        <StudentServicesProvider>
          <AuthStateProvider>
            {children}
          </AuthStateProvider>
        </StudentServicesProvider>
      </ServicesProvider>
    </body>
  </html>
);

export default RootLayout;
