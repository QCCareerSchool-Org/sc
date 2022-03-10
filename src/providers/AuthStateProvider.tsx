import type { Dispatch, ReactElement, ReactNode } from 'react';
import { createContext, useReducer } from 'react';
import type { AuthAction, AuthState } from '../state/auth';
import { authInitializer, authInitialState, authReducer } from '../state/auth';

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthStateProvider = ({ children }: Props): ReactElement => {
  const [ state, dispatch ] = useReducer(authReducer, authInitialState, authInitializer);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
