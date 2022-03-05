import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { AssignmentSection } from './AssignmentSection';
import { AssignmentStatus } from './AssignmentStatus';
import { SkipSection } from './SkipSection';
import { initialState, reducer, State } from './state';
import { SubmitSection } from './SubmitSection';
import { HttpServiceError } from '@/services/httpService';
import { newUnitService } from '@/services/students';
import { formatDate } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
};

export const NewUnitView = ({ studentId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const submit$ = useRef(new Subject<State['processingState']>());
  const skip$ = useRef(new Subject<State['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(studentId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unit => dispatch({ type: 'UNIT_LOAD_SUCEEDED', payload: unit }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'UNIT_LOAD_FAILED', payload: errorCode });
      },
    });

    submit$.current.pipe(
      filter(processingState => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SUBMIT_STARTED' })),
      exhaustMap(() => newUnitService.submitUnit(studentId, courseId, unitId).pipe(
        tap({
          next: () => dispatch({ type: 'SUBMIT_SUCCEEDED' }),
          error: err => {
            let message = 'Submit failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SUBMIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    skip$.current.pipe(
      filter(processingState => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SKIP_STARTED' })),
      exhaustMap(() => newUnitService.skipUnit(studentId, courseId, unitId).pipe(
        tap({
          next: () => dispatch({ type: 'SKIP_SUCEEDED' }),
          error: err => {
            let message = 'Skip failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SKIP_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, courseId, unitId, router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.unit) {
    return null;
  }

  const showAssignments = (!!state.unit.marked || !(!!state.unit.skipped || !!state.unit.submitted));

  const status = state.unit.marked
    ? 'Marked'
    : state.unit.submitted
      ? 'Submitted'
      : state.unit.adminComment
        ? 'Returned for Changes'
        : 'In Progress';

  return (
    <>
      <section>
        <div className="container">
          <h1>Unit {state.unit.unitLetter}{state.unit.title && <>: {state.unit.title}</>}</h1>
          {state.unit.description && <p>{state.unit.description}</p>}
          <table className="table table-bordered bg-white w-auto">
            <tbody>
              <tr><th scope="row">Started</th><td>{formatDate(state.unit.created)}</td></tr>
              <tr><th scope="row">Submitted</th><td>{state.unit.submitted ? formatDate(state.unit.submitted) : '---'}</td></tr>
              <tr><th scope="row">Marked</th><td>{state.unit.marked ? formatDate(state.unit.marked) : '---'}</td></tr>
              <tr><th scope="row">Status</th><td>{status}</td></tr>
            </tbody>
          </table>
          <AssignmentStatus unit={state.unit} />
        </div>
      </section>
      {showAssignments && <AssignmentSection unit={state.unit} />}
      {!state.unit.submitted && !state.unit.skipped && (
        <>
          <SubmitSection
            submit$={submit$.current}
            unitComplete={state.unit.complete}
            processingState={state.processingState}
            errorMessage={state.errorMessage}
          />
          {state.unit.optional && (
            <SkipSection
              skip$={skip$.current}
              processingState={state.processingState}
              errorMessage={state.errorMessage}
            />
          )}
        </>
      )}
    </>
  );
};
