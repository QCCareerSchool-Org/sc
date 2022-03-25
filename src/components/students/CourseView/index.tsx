import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { initialState, reducer } from './state';
import { UnitsTable } from './UnitsTable';
import { Section } from '@/components/Section';
import type { NewUnit } from '@/domain/newUnit';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  studentId: number;
  courseId: number;
};

export const CourseView = ({ studentId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const { enrollmentService, newUnitService } = useStudentServices();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const initialize$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    enrollmentService.getEnrollment(studentId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: enrollment => {
        dispatch({ type: 'LOAD_ENROLLMENT_SUCCEEDED', payload: enrollment });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ENROLLMENT_FAILED', payload: errorCode });
      },
    });

    initialize$.current.pipe(
      tap(() => dispatch({ type: 'INITIALIZE_UNIT_STARTED' })),
      switchMap(() => newUnitService.initializeNextUnit(studentId, courseId).pipe(
        tap({
          next: newUnit => {
            dispatch({ type: 'INITIALIZE_UNIT_SUCCEEDED', payload: newUnit });
            void router.push(router.asPath + '/units/' + newUnit.unitId);
          },
          error: err => {
            let message = 'Initialize failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'INITIALIZE_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, studentId, courseId, enrollmentService, newUnitService ]);

  const newUnitClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(router.asPath + '/units/' + unitId);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.enrollment) {
    return null;
  }

  const nextUnit = getNextUnit(state.enrollment.course.newUnitTemplates, state.enrollment.newUnits);

  const initializeButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    initialize$.current.next();
  };

  return (
    <Section>
      <div className="container">
        <h1>{state.enrollment.course.name}</h1>
        <UnitsTable newUnits={state.enrollment.newUnits} newUnitClick={newUnitClick} />
        {nextUnit && <button onClick={initializeButtonClick} className="btn btn-primary">Start Unit {nextUnit}</button>}
      </div>
    </Section>
  );
};

const getNextUnit = (newUnitTemplates: NewUnitTemplate[], newUnits: NewUnit[]): string | null => {
  return 'A';
};
