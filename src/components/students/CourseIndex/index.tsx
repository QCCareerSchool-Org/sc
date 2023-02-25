import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import { ContinuingEducationGroup } from './ContinuingEducationGroup';
import { CourseGrid } from './CourseGrid';
import { courseSuggestionGroups } from './courseSuggestions';
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

  const schools = useMemo(() => {
    return state.student?.enrollments
      .map(e => e.course.school.slug)
      .filter((item, pos, self) => self.indexOf(item) === pos);
  }, [ state.student?.enrollments ]);

  const courses = useMemo(() => state.student?.enrollments.map(e => e.course), [ state.student?.enrollments ]);

  if (!state.student || !courses) {
    return null;
  }

  const student = state.student;

  return (
    <>
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
      <Section className="bg-f1">
        <div className="container">
          <h2 className="h4">Continued Education</h2>
          {schools?.map(s => courseSuggestionGroups[s].map(group => {
            return <ContinuingEducationGroup key={group.id} countryCode={student.country.code} provinceCode={student.province?.code} group={group} disabledCourses={courses} />;
          }))}
        </div>
      </Section>
    </>
  );
};
