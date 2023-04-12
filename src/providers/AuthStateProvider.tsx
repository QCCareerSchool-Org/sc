import type { Dispatch, FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';

import type { AuthAction, AuthState } from '@/state/auth';
import { authInitializer, authInitialState, authReducer } from '@/state/auth';

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthStateProvider: FC<Props> = ({ children }) => {
  // can't use authInitializer here, because it's output on the server is different from the client
  const [ state, dispatch ] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    // use authInitializer here instead
    dispatch({ type: 'INITIALIZE', payload: authInitializer() });
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
