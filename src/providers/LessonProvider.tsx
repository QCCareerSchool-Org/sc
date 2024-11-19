import type { Dispatch, FC, PropsWithChildren } from 'react';
import { createContext, useReducer } from 'react';

import type { LessonAction, LessonState } from '@/state/lesson';
import { lessonInitialState, lessonReducer } from '@/state/lesson';

export const LessonStateContext = createContext<LessonState | undefined>(undefined);
export const LessonDispatchContext = createContext<Dispatch<LessonAction> | undefined>(undefined);

export const LessonStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ state, dispatch ] = useReducer(lessonReducer, lessonInitialState);

  return (
    <LessonStateContext.Provider value={state}>
      <LessonDispatchContext.Provider value={dispatch}>
        {children}
      </LessonDispatchContext.Provider>
    </LessonStateContext.Provider>
  );
};
