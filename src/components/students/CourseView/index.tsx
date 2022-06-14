import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { endpoint } from '../../../basePath';
import { initialState, reducer } from './state';
import { UnitsTable } from './UnitsTable';
import { useInitialData } from './useInitialData';
import { useInitializeNextUnit } from './useInitializeNextUnit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import type { NewUnit } from '@/domain/newUnit';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import { useStayLoggedIn } from '@/hooks/useStayLoggedIn';

type Props = {
  studentId: number;
  courseId: number;
};

export const CourseView = ({ studentId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  // we're going to be linking to static resources that require the user to be
  // logged in, and those resources don't have a refresh built-in mechanism
  useStayLoggedIn();

  useInitialData(studentId, courseId, dispatch);

  const initializeNextUnit$ = useInitializeNextUnit(dispatch);

  const handleNewUnitClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(router.asPath + '/units/' + unitId);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.enrollment) {
    return null;
  }

  const nextUnit = getNextUnit(state.enrollment.course.newUnitTemplates, state.enrollment.newUnits);

  const handleInitializeButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    initializeNextUnit$.next({
      processingState: state.form.processingState,
      studentId,
      courseId,
    });
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>{state.enrollment.course.name}</h1>
          <UnitsTable newUnits={state.enrollment.newUnits} onNewUnitClick={handleNewUnitClick} />
          {nextUnit && (
            <div className="d-flex align-items-center">
              <button onClick={handleInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }}>
                {state.form.processingState === 'initializing'
                  ? <Spinner size="sm" />
                  : <>Start Unit {nextUnit}</>
                }
              </button>
              {state.form.processingState === 'initialize error' && <span className="text-danger ms-2">{state.form.errorMessage ?? 'initializing'}</span>}
            </div>
          )}
        </div>
      </Section>
      <Section>
        <div className="container">
          <h1>Lessons</h1>
          <Link href={`${endpoint}/students/${studentId}/static/lessons/95/6630b210-de75-11ec-bbd6-b5db70b35693/content`}><a target="_blank" rel="noopener noreferrer">sdkjfhsdkjfhdsf</a></Link>
        </div>
      </Section>
    </>
  );
};

const getNextUnit = (newUnitTemplates: NewUnitTemplate[], newUnits: NewUnit[]): string | null => {
  return 'A';
};
