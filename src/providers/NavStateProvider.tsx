import type { Dispatch, FC, ReactNode } from 'react';
import { createContext, useReducer } from 'react';

import type { NavAction, NavState } from '@/state/nav';
import { navInitialState, navReducer } from '@/state/nav';

export const NavStateContext = createContext<NavState | undefined>(undefined);
export const NavDispatchContext = createContext<Dispatch<NavAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const NavStateProvider: FC<Props> = ({ children }) => {
  const [ state, dispatch ] = useReducer(navReducer, navInitialState);
  return (
    <NavStateContext.Provider value={state}>
      <NavDispatchContext.Provider value={dispatch}>
        {children}
      </NavDispatchContext.Provider>
    </NavStateContext.Provider>
  );
};
