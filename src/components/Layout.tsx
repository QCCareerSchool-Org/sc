import type { ReactElement, ReactNode } from 'react';
import { SiteNav } from './nav';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props): ReactElement => (
  <div className="d-flex flex-column vh-100">
    <SiteHeader />
    <SiteNav />
    <main className="d-flex flex-column flex-shrink-0">
      {children}
    </main>
    <SiteFooter />
  </div>
);
