import { createContext, Dispatch, ReactElement, ReactNode, useReducer } from 'react';
import { NavAction, navInitialState, navReducer, NavState } from '../state/nav';

export const NavStateContext = createContext<NavState | undefined>(undefined);
export const NavDispatchContext = createContext<Dispatch<NavAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const NavStateProvider = ({ children }: Props): ReactElement => {
  const [ state, dispatch ] = useReducer(navReducer, navInitialState);
  return (
    <NavStateContext.Provider value={state}>
      <NavDispatchContext.Provider value={dispatch}>
        {children}
      </NavDispatchContext.Provider>
    </NavStateContext.Provider>
  );
};
