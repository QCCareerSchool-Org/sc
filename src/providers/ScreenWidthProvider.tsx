import type { FC, ReactNode } from 'react';
import { createContext } from 'react';
import { useSyncWindowListener } from 'use-window-listener';

export const ScreenWidthContext = createContext<number | null | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const valueSelector = (w: Window) => w.innerWidth;

export const ScreenWidthProvider: FC<Props> = ({ children }) => {
  const state = useSyncWindowListener('resize', valueSelector, null);

  return (
    <ScreenWidthContext.Provider value={state}>
      {children}
    </ScreenWidthContext.Provider>
  );
};
