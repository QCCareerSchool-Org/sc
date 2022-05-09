import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import { AssignmentSection } from './AssignmentSection';
import { NewUnitInfoTable } from './NewUnitInfoTable';
import { NewUnitStatus } from './NewUnitStatus';
import { SkipSection } from './SkipSection';
import type { State } from './state';
import { initialState, reducer } from './state';
import { SubmitSection } from './SubmitSection';
import { Section } from '@/components/Section';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
};

export const NewUnitView = ({ studentId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const { newUnitService } = useStudentServices();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const submit$ = useRef(new Subject<State['processingState']>());
  const skip$ = useRef(new Subject<State['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(studentId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unit => dispatch({ type: 'LOAD_UNIT_SUCEEDED', payload: unit }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_FAILED', payload: errorCode });
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
              if (err.login) {
                return void navigateToLogin(router);
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
              if (err.login) {
                return void navigateToLogin(router);
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
  }, [ studentId, courseId, unitId, router, newUnitService ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newUnit) {
    return null;
  }

  const showAssignments = (!!state.newUnit.closed || !state.newUnit.submitted);

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              {state.newUnit.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Unit {state.newUnit.unitLetter}{state.newUnit.title && <>: {state.newUnit.title}</>}</h1>
              <NewUnitInfoTable newUnit={state.newUnit} />
              <NewUnitStatus studentId={studentId} courseId={courseId} newUnit={state.newUnit} />
            </div>
          </div>
        </div>
      </Section>
      {showAssignments && <AssignmentSection unit={state.newUnit} />}
      {!state.newUnit.submitted && (
        <>
          <SubmitSection
            submit$={submit$.current}
            unitComplete={state.newUnit.complete}
            optionalAssignmentsIncomplete={state.optionalAssignmentIncomplete}
            processingState={state.processingState}
            errorMessage={state.errorMessage}
          />
          {state.newUnit.optional && (
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
