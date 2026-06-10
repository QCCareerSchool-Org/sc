'use client';
import type { FC, PropsWithChildren } from 'react';

import 'src/style.scss';
import '@fontsource/great-vibes';
import '@fontsource/cinzel';
import { ServicesProvider } from '@/providers/ServicesProvider';

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      <ServicesProvider>
        {children}
      </ServicesProvider>
    </body>
  </html>
);

export default RootLayout;
