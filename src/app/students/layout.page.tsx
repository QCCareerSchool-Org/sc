'use client';
import type { FC, PropsWithChildren } from 'react';

import 'src/style.scss';
import '@fontsource/great-vibes';
import '@fontsource/cinzel';
import { AuthStateProvider } from '@/providers/AuthStateProvider';

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      <AuthStateProvider>
        {children}
      </AuthStateProvider>
    </body>
  </html>
);

export default RootLayout;
