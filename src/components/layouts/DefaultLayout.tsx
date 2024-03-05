import type { FC, ReactNode } from 'react';

import { Banner } from '../banner';
import { SiteNav } from '@/components/nav';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

type Props = {
  children: ReactNode;
};

export const DefaultLayout: FC<Props> = ({ children }) => (
  <div className="d-flex flex-column vh-100">
    <Banner />
    <SiteHeader />
    <SiteNav />
    <main className="d-flex flex-column flex-shrink-0">
      {children}
    </main>
    <SiteFooter />
  </div>
);
