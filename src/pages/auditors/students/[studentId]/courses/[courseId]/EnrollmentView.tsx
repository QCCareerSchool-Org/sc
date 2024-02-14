import { type FC, useReducer } from 'react';

import { CourseProgress } from '../../CourseProgress';
import { NewSubmissionsTable } from './NewSubmissionsTable';
import { initialState, reducer } from './state';
import { UnitsTable } from './UnitsTable';
import { useInitialData } from './useInitialData';
import { formatDate } from 'src/formatDate';

type Props = {
  auditorId: number;
  studentId: number;
  courseId: number;
};

export const EnrollmentView: FC<Props> = ({ auditorId, studentId, courseId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, auditorId, studentId, courseId);

  return (
    <section>
      <div className="container">
        <h1>Course Details</h1>
        {state.enrollment && (
          <>
            <table className="table table-bordered w-auto">
              <tbody>
                <tr><th scope="row">Course</th><td>{state.enrollment.course.name}</td></tr>
                <tr><th scope="row">Enrollment Date</th><td>{state.enrollment.enrollmentDate ? formatDate(state.enrollment.enrollmentDate) : 'N/A'}</td></tr>
                {!state.enrollment.course.noTutor && (
                  <tr><th scope="row">Tutor</th><td>{state.enrollment.tutor ? `${state.enrollment.tutor.firstName} ${state.enrollment.tutor.lastName}` : 'N/A'}</td></tr>
                )}
                <tr><th scope="row">Progress</th><td><CourseProgress enrollment={state.enrollment} /></td></tr>
              </tbody>
            </table>
            {state.enrollment.course.units.length > 0 && <UnitsTable enrollment={state.enrollment} />}
            {state.enrollment.newSubmissions.length > 0 && <NewSubmissionsTable newSubmissions={state.enrollment.newSubmissions} />}
          </>
        )}
      </div>
    </section>
  );
};
