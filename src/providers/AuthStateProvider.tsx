import { createContext, Dispatch, ReactElement, ReactNode, useReducer } from 'react';
import { AuthAction, authReducer, AuthState } from '../state/auth';

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthStateProvider = ({ children }: Props): ReactElement => {
  const [ state, dispatch ] = useReducer(authReducer, {});
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
