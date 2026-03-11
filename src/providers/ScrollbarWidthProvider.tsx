import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export const ScrollbarWidthContext = createContext<number | undefined>(undefined);

export const ScrollbarWidthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ state, dispatch ] = useState(17);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    dispatch(window.innerWidth - document.body.clientWidth);
  }, []);

  return (
    <ScrollbarWidthContext.Provider value={state}>
      {children}
    </ScrollbarWidthContext.Provider>
  );
};
