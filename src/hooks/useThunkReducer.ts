import type { Dispatch } from 'react';
import { useCallback, useRef, useState } from 'react';

type ReducerFunction<State, Action extends Record<string, unknown>> = (state: State, action: Action) => State;
type InitializerFunction<State> = (state: State) => State;

type ThunkFunction<State, Action extends Record<string, unknown>> = (dispatch: Dispatch<Action>, getState: () => State) => void;

export const useThunkReducer = <State, Action extends Record<string, unknown>>(reducer: ReducerFunction<State, Action>, initialArg: State, init: InitializerFunction<State> = a => a): [ state: State, dispatch: (action: Action | ThunkFunction<State, Action>) => void ] => {
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

/**
type MyState = {
  x: number;
};

type MyAction = { type: 'INCREMENT'; payload: number };

const myReducer = (state: MyState, action: MyAction): MyState => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, x: state.x + 1 };
  }
};

const getFoo = (dispatch: Dispatch<MyAction>): void => {
  void fetch('').then(async response => {
    return response.json();
  }).then(body => {
    dispatch({ type: 'INCREMENT', payload: body.count });
  });
};

export const useFoo = (): void => {
  const [ state, dispatch ] = useThunkReducer(myReducer, { x: 0 });
  dispatch({ type: 'INCREMENT', payload: 2 });
  dispatch(getFoo);
};
 */
