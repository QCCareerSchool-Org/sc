import type { FC, PropsWithChildren } from 'react';

import { Banner } from '../banner';
import { SiteNav } from '@/components/nav';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => (
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
