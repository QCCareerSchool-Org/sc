'use client';
import type { FC, PropsWithChildren } from 'react';

import 'src/style.scss';
import '@fontsource/great-vibes';
import '@fontsource/cinzel';

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      {children}
    </body>
  </html>
);

export default RootLayout;
