import { type FC, useReducer } from 'react';

import { EnrollmentsTable } from './enrollmentsTablex';
import { initialState, reducer } from './state';
import { StudentDetails } from './studentDetailsx';
import { useInitialData } from './useInitialData';
import { Spinner } from '@/components/Spinner';

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
        <h1>Student Details</h1>
        {state.student
          ? (
            <>
              <StudentDetails student={state.student} />
              <h2>Courses</h2>
              <EnrollmentsTable student={state.student} />
            </>
          )
          : <Spinner />
        }
      </div>
    </section>
  );
};
