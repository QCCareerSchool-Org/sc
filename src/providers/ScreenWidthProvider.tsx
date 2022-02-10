import { createContext, ReactElement, ReactNode, useEffect, useState } from 'react';

export const ScreenWidthContext = createContext<number | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ScreenWidthProvider = ({ children }: Props): ReactElement => {
  const [ state, dispatch ] = useState(0);

  useEffect(() => {
    dispatch(window.innerWidth);
    const handleResize = (): void => dispatch(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ScreenWidthContext.Provider value={state}>
      {children}
    </ScreenWidthContext.Provider>
  );
};
