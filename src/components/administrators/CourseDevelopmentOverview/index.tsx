import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, ReactElement } from 'react';
import { useReducer } from 'react';

import { SchoolList } from './SchoolList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
};

export const CourseDevelopmentOverview = ({ administratorId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.schools) {
    return null;
  }

  const handleSchoolRowClick = (e: MouseEvent<HTMLTableRowElement>, schoolId: number): void => {
    void router.push(`/administrators/schools/${schoolId}`);
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Course Development</h1>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Schools</h2>
          <SchoolList schools={state.schools} onClick={handleSchoolRowClick} />
        </div>
      </Section>
    </>
  );
};
