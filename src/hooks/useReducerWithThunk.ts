import { useReducer } from 'react';

export const useReducerWithThunk = <State, Action>(reducer: (state: State, action: Action) => State, initialState: State): [ State, (action: Action) => void ] => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const customDispatch = (a: Action): void => {
    if (typeof a === 'function') {
      a(customDispatch);
    } else {
      dispatch(a);
    }
  };

  return [ state, customDispatch ];
};
