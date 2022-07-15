import type { Dispatch, ReactElement, ReactNode } from 'react';
import { createContext, useReducer } from 'react';
import type { UnitToggleAction, UnitToggleState } from '../state/unitToggles';
import { unitToggleInitializer, unitToggleInitialState, unitToggleReducer } from '../state/unitToggles';

export const UnitToggleStateContext = createContext<UnitToggleState | undefined>(undefined);
export const UnitToggleDispatchContext = createContext<Dispatch<UnitToggleAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const UnitToggleStateProvider = ({ children }: Props): ReactElement => {
  const [ state, dispatch ] = useReducer(unitToggleReducer, unitToggleInitialState, unitToggleInitializer);
  return (
    <UnitToggleStateContext.Provider value={state}>
      <UnitToggleDispatchContext.Provider value={dispatch}>
        {children}
      </UnitToggleDispatchContext.Provider>
    </UnitToggleStateContext.Provider>
  );
};
