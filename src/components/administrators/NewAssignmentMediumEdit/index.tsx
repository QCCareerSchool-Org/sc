import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewAssignmentMediumEditForm } from './NewAssignmentMediumEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { PdfIcon } from '@/components/PdfIcon';
import { newAssignmentMediumService } from '@/services/administrators';
import type { NewAssignmentMediumEditPayload } from '@/services/administrators/newAssignmentMediumService';
import { HttpServiceError } from '@/services/httpService';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  mediumId: string;
};

export const NewAssignmentMediumEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, mediumId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewAssignmentMediumEditPayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newAssignmentMediumService.getAssignmentMedium(administratorId, schoolId, courseId, unitId, assignmentId, mediumId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignmentMedium => {
        dispatch({ type: 'LOAD_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: newAssignmentMedium });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_MEDIUM_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ payload }) => newAssignmentMediumService.saveAssignmentMedium(administratorId, schoolId, courseId, unitId, assignmentId, mediumId, payload).pipe(
        tap({
          next: updatedAssignmentMedium => {
            dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: updatedAssignmentMedium });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(() => newAssignmentMediumService.deleteAssignmentMedium(administratorId, schoolId, courseId, unitId, assignmentId, mediumId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_SUCCEEDED' });
            router.back();
          },
          error: err => {
            let message = 'Delete failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, mediumId ]);

  const captionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignmentMedium) {
    return null;
  }

  const src = `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/media/${state.newAssignmentMedium.assignmentMediumId}/file`;

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Assignment Media</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentMediumEditForm
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                captionChange={captionChange}
                orderChange={orderChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Assignment Template</th><td>{state.newAssignmentMedium.newAssignmentTemplate.title ?? state.newAssignmentMedium.newAssignmentTemplate.assignmentNumber}</td></tr>
                    <tr><th scope="row">Linked Assignments</th><td>{state.newAssignmentMedium.newAssignments.length}</td></tr>
                    <tr><th scope="row">Filename</th><td>{state.newAssignmentMedium.filename}</td></tr>
                    <tr><th scope="row">Type</th><td>{state.newAssignmentMedium.type}</td></tr>
                    <tr><th scope="row">Mime Type</th><td>{state.newAssignmentMedium.mimeTypeId}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newAssignmentMedium.created)}</td></tr>
                    {state.newAssignmentMedium.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newAssignmentMedium.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          {state.newAssignmentMedium.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} className="mediaContent" alt={state.newAssignmentMedium.caption} />
          )}
          {state.newAssignmentMedium.type === 'video' && (
            <video className="mediaContent" controls>
              <source src={src} type={state.newAssignmentMedium.mimeTypeId} />
            </video>
          )}
          {state.newAssignmentMedium.type === 'audio' && (
            <audio controls>
              <source src={src} type={state.newAssignmentMedium.mimeTypeId} />
            </audio>
          )}
          {state.newAssignmentMedium.type === 'download' && (
            <a href={src} download><PdfIcon /></a>
          )}
        </div>
      </section>
    </>
  );
};
