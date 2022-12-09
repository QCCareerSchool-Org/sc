import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import { CourseGrid } from './CourseGrid';
import { CourseWarnings } from './CourseWarnings';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  studentId: number;
};

export const CourseIndex: FC<Props> = ({ studentId }) => {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId);

  const courses = useMemo(() => state.student?.enrollments.map(e => e.course), [ state.student?.enrollments ]);

  if (!state.student || !courses) {
    return null;
  }

  return (
    <Section>
      <div className="container">
        <h1>Online Student Center</h1>
        {state.student.enrollments.length === 0
          ? <p className="lead">No enrollments found.</p>
          : (
            <>
              <CourseWarnings courses={courses} />
              <CourseGrid enrollments={state.student.enrollments} />
            </>
          )
        }
      </div>
    </Section>
  );
};
