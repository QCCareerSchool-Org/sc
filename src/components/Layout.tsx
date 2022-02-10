import { ReactElement, ReactNode } from 'react';
import { SiteNav } from './nav';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props): ReactElement => {
  console.log('layout rendered');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SiteHeader />
      <SiteNav />
      <main style={{ display: 'flex', flexShrink: 0 }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
