import type { FC, PropsWithChildren } from 'react';

export const LessonLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="d-flex flex-column vh-100">
    <main className="d-flex flex-column flex-grow-1">
      {children}
    </main>
  </div>
);
