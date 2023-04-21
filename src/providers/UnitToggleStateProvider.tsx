import type { Dispatch, FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';
import type { UnitToggleAction, UnitToggleState } from '@/state/unitToggles';
import { unitToggleInitializer, unitToggleInitialState, unitToggleReducer } from '@/state/unitToggles';

export const UnitToggleStateContext = createContext<UnitToggleState | undefined>(undefined);
export const UnitToggleDispatchContext = createContext<Dispatch<UnitToggleAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const UnitToggleStateProvider: FC<Props> = ({ children }) => {
  // can't use unitToggleInitializer here, because it's output on the server is different from the client
  const [ state, dispatch ] = useReducer(unitToggleReducer, unitToggleInitialState);

  useEffect(() => {
    // use unitToggleInitializer here instead
    dispatch({ type: 'INITIALIZE', payload: unitToggleInitializer(unitToggleInitialState) });
  }, []);

  return (
    <UnitToggleStateContext.Provider value={state}>
      <UnitToggleDispatchContext.Provider value={dispatch}>
        {children}
      </UnitToggleDispatchContext.Provider>
    </UnitToggleStateContext.Provider>
  );
};
