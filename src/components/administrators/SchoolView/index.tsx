import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { CourseList } from './CourseList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  schoolId: number;
};

export const SchoolView: FC<Props> = ({ administratorId, schoolId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, schoolId);

  const handleCourseRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, courseId: number): void => {
    void router.push(`/administrators/courses/${courseId}`);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.school) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>School: {state.school.name}</h1>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Courses</h2>
          <CourseList courses={state.school.courses} onClick={handleCourseRowClick} />
        </div>
      </Section>
    </>
  );
};
