import type { Dispatch } from 'react';
import { useCallback, useRef, useState } from 'react';

type ReducerFunction<State, Action extends Record<string, unknown>> = (state: State, action: Action) => State;
type InitializerFunction<State> = (state: State) => State;

type ThunkFunction<State, Action extends Record<string, unknown>> = (dispatch: Dispatch<Action>, getState: () => State) => void;

export const useThunkReducer = <State, Action extends Record<string, unknown>>(reducer: ReducerFunction<State, Action>, initialArg: State, init: InitializerFunction<State> = a => a): [ State, (action: Action | ThunkFunction<State, Action>) => void ] => {
  const [ hookState, setHookState ] = useState(init(initialArg));

  // state management
  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [ state ]);
  const setState = useCallback<(newState: State) => void>(newState => {
    state.current = newState;
    setHookState(newState);
  }, [ state, setHookState ]);

  // reducer
  const reduce = useCallback((action: Action) => {
    return reducer(getState(), action);
  }, [ reducer, getState ]);

  // augmented dispatcher
  const dispatch = useCallback((action: Action | ThunkFunction<State, Action>): void => {
    return typeof action === 'function'
      ? action(dispatch, getState)
      : setState(reduce(action));
  }, [ getState, setState, reduce ]);

  return [ hookState, dispatch ];
};
