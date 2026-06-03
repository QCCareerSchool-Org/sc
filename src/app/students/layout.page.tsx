import type { FC, PropsWithChildren } from 'react';
import 'src/style.scss';

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      {children}
    </body>
  </html>
);

export default RootLayout;
