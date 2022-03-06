import NextError from 'next/error';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { CourseList } from './CourseList';
import { initialState, reducer } from './state';
import { schoolService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
};

export const SchoolView = ({ administratorId, schoolId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    schoolService.getSchool(administratorId, schoolId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: school => {
        dispatch({ type: 'SCHOOL_LOAD_SUCCEEDED', payload: school });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'SCHOOL_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.school) {
    return null;
  }

  const courseRowClick = (e: MouseEvent<HTMLTableRowElement>, courseId: number): void => {
    void router.push(`${router.asPath}/courses/${courseId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>School: {state.school.name}</h1>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Courses</h2>
          <CourseList courses={state.school.courses} courseRowClick={courseRowClick} />
        </div>
      </section>
    </>
  );
};
