import NextError from 'next/error';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { initialState, reducer } from './state';
import { UnitList } from './UnitList';
import { courseService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
};

export const CourseView = ({ administratorId, schoolId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, schoolId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'COURSE_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'COURSE_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.course) {
    return null;
  }

  const unitRowClick = (e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(`${router.asPath}/newUnitTemplates/${unitId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Course: {state.course.name}</h1>
          <table className="table table-bordered w-auto">
            <tbody>
              <tr><th scope="row">Code</th><td>{state.course.code}</td></tr>
              <tr><th scope="row">Version</th><td>{state.course.version}</td></tr>
              <tr><th scope="row">School</th><td>{state.course.school.name}</td></tr>
              <tr><th scope="row">Course Guide</th><td>{state.course.courseGuide ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Quizzes Enabled</th><td>{state.course.quizzesEnabled ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">No Tutor</th><td>{state.course.noTutor ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Unit Type</th><td>{state.course.unitType}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Units</h2>
          <UnitList units={state.course.newUnitTemplates} unitRowClick={unitRowClick} />
        </div>
      </section>
    </>
  );
};
