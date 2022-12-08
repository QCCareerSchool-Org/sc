import type { FC } from 'react';
import { useReducer } from 'react';

import { CourseButton } from './CourseButton';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  studentId: number;
};

export const CourseIndex: FC<Props> = ({ studentId }) => {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId);

  if (!state.student) {
    return null;
  }

  return (
    <Section>
      <div className="container">
        <h1>Online Student Center</h1>
        <div className="row">
          {state.student.enrollments.map(e => (
            <div key={e.enrollmentId} className="col-6 col-md-4">
              <CourseButton courseId={e.courseId} courseName={e.course.name} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
