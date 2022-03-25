import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, ReactElement } from 'react';
import { useReducer } from 'react';

import { CourseList } from './CourseList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  schoolId: number;
};

export const SchoolView = ({ administratorId, schoolId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, schoolId, dispatch);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.school) {
    return null;
  }

  const courseRowClick = (e: MouseEvent<HTMLTableRowElement>, courseId: number): void => {
    void router.push(`${router.asPath}/courses/${courseId}`);
  };

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
          <CourseList courses={state.school.courses} courseRowClick={courseRowClick} />
        </div>
      </Section>
    </>
  );
};
