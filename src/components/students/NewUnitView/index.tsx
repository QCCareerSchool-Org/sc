import Error from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { initialState, reducer } from './state';
import { View } from './View';
import { HttpServiceError } from '@/services/httpService';
import { newUnitService } from '@/services/students';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
};

export const NewUnitView = ({ studentId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const submit$ = useRef(new Subject<void>());
  const skip$ = useRef(new Subject<void>());

  const filteredSubmit$ = useRef(submit$.current.pipe(
    filter(() => {
      return state.submit !== 'processing' && state.skip !== 'processing';
    }),
    tap(() => console.log('statrt')),
    tap(() => dispatch({ type: 'SUBMIT_STARTED' })),
  ));

  const filteredSkips$ = useRef(skip$.current.pipe(
    filter(() => {
      return state.submit !== 'processing' && state.skip !== 'processing';
    }),
    tap(() => dispatch({ type: 'SKIP_STARTED' })),
  ));

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(studentId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unit => dispatch({ type: 'UNIT_LOAD_SUCEEDED', payload: unit }),
      error: err => {
        if (err instanceof HttpServiceError && err.refresh) {
          return void navigateToLogin(router);
        }
        dispatch({ type: 'UNIT_LOAD_FAILED' });
      },
    });

    filteredSubmit$.current.pipe(
      exhaustMap(() => newUnitService.submitUnit(studentId, courseId, unitId).pipe(
        // handle errors here and return EMPTY to keep the subscription running
        catchError(err => {
          if (err instanceof HttpServiceError && err.refresh) {
            void navigateToLogin(router);
            return EMPTY;
          }
          dispatch({ type: 'SUBMIT_FAILED', payload: err.message });
          return EMPTY;
        }),
      )),
      takeUntil(destroy$),
    ).subscribe({
      next: () => dispatch({ type: 'SUBMIT_SUCCEEDED' }),
      error: () => console.log('ERRORRRR!!!'),
    });

    filteredSkips$.current.pipe(
      exhaustMap(() => newUnitService.skipUnit(studentId, courseId, unitId).pipe(
        // handle errors here and return EMPTY to keep the subscription running
        catchError(err => {
          if (err instanceof HttpServiceError && err.refresh) {
            void navigateToLogin(router);
            return EMPTY;
          }
          dispatch({ type: 'SKIP_FAILED', payload: err.message });
          return EMPTY;
        }),
      )),
      takeUntil(destroy$),
    ).subscribe(() => {
      dispatch({ type: 'SKIP_SUCEEDED' });
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, courseId, unitId, router ]);

  if (state.error) {
    return <Error statusCode={500} />;
  }

  return <View state={state} submit$={submit$.current} skip$={skip$.current} />;
};
