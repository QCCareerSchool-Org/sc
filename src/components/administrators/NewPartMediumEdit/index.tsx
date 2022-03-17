import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewPartMediumEditForm } from './NewPartMediumEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { FileIcon } from '@/components/FileIcon';
import { newPartMediumService } from '@/services/administrators';
import type { NewPartMediumEditPayload } from '@/services/administrators/newPartMediumService';
import { HttpServiceError } from '@/services/httpService';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';
import { humanReadableFileSize } from 'src/humanReadableFilesize';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  mediumId: string;
};

export const NewPartMediumEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewPartMediumEditPayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newPartMediumService.getPartMedium(administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignmentMedium => {
        dispatch({ type: 'LOAD_PART_MEDIUM_SUCCEEDED', payload: newAssignmentMedium });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_PART_MEDIUM_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_PART_MEDIUM_STARTED' })),
      exhaustMap(({ payload }) => newPartMediumService.savePartMedium(administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId, payload).pipe(
        tap({
          next: updatedAssignmentMedium => {
            dispatch({ type: 'SAVE_PART_MEDIUM_SUCCEEDED', payload: updatedAssignmentMedium });
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
            dispatch({ type: 'SAVE_PART_MEDIUM_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_PART_MEDIUM_STARTED' })),
      exhaustMap(() => newPartMediumService.deletePartMedium(administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_PART_MEDIUM_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_PART_MEDIUM_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId ]);

  const captionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newPartMedium) {
    return null;
  }

  const src = `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}/media/${state.newPartMedium.partMediumId}/file`;

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Part Media</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewPartMediumEditForm
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
                    <tr><th scope="row">Part Template</th><td>{state.newPartMedium.newPartTemplate.title}</td></tr>
                    <tr><th scope="row">Linked Parts</th><td>{state.newPartMedium.newParts.length}</td></tr>
                    <tr><th scope="row">Filename</th><td>{state.newPartMedium.filename}</td></tr>
                    <tr><th scope="row">Type</th><td>{state.newPartMedium.type}</td></tr>
                    <tr><th scope="row">Mime Type</th><td>{state.newPartMedium.mimeTypeId}</td></tr>
                    <tr><th scope="row">Size</th><td>{humanReadableFileSize(state.newPartMedium.size)}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newPartMedium.created)}</td></tr>
                    {state.newPartMedium.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newPartMedium.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          {state.newPartMedium.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} className="mediaContent" alt={state.newPartMedium.caption} />
          )}
          {state.newPartMedium.type === 'video' && (
            <video className="mediaContent" controls>
              <source src={src} type={state.newPartMedium.mimeTypeId} />
            </video>
          )}
          {state.newPartMedium.type === 'audio' && (
            <audio controls>
              <source src={src} type={state.newPartMedium.mimeTypeId} />
            </audio>
          )}
          {state.newPartMedium.type === 'download' && (
            <a href={src} download><FileIcon mimeType={state.newPartMedium.mimeTypeId} size={96} /></a>
          )}
        </div>
      </section>
    </>
  );
};
