import { type FC, useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';

type Props = {
  auditorId: number;
  studentId: number;
};

export const StudentView: FC<Props> = ({ auditorId, studentId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, auditorId, studentId);

  return (
    <section>
      <div className="container">
        <h1>Student {studentId}</h1>
        <pre>
          {JSON.stringify(state.student, null, ' ')}
        </pre>
      </div>
    </section>
  );
};
