import type { FC, PropsWithChildren } from 'react';

import { SiteNav } from '@/components/nav';

export const LessonLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="d-flex flex-column vh-100">
    <SiteNav />
    <main className="d-flex flex-column flex-grow-1">
      {children}
    </main>
  </div>
);
