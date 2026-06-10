// eslint-disable-next-line camelcase
import { Cinzel, Great_Vibes } from 'next/font/google';
import type { FC, PropsWithChildren } from 'react';

import 'src/style.scss';

const cinzel = Cinzel({
  weight: [ '400', '700' ],
  style: [ 'normal' ],
  variable: '--font-cinzel',
});

const greatVibes = Great_Vibes({
  weight: '400',
  style: [ 'normal' ],
  variable: '--font-great-vibes',
});

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" data-scroll-behavior="smooth" className={`${cinzel.variable} ${greatVibes.variable}`}>
    <body>
      {children}
    </body>
  </html>
);

export default RootLayout;
