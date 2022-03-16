import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartForm } from './NewPartForm';
import { initialState, reducer } from './state';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { HttpServiceError } from '@/services/httpService';
import { newAssignmentService } from '@/services/students';
import { navigateToLogin } from 'src/navigateToLogin';

export type UploadSlotFunction = (partId: string, uploadSlotId: string, file?: File) => Observable<unknown>;
export type TextBoxFunction = (partId: string, textBoxId: string, text: string) => Observable<unknown>;

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentView = ({ studentId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(state.assignment && state.assignment?.formState !== 'pristine' && state.assignment?.saveState !== 'saved');

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentService.getAssignment(studentId, courseId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: data => dispatch({ type: 'ASSIGNMENT_LOAD_SUCCEEDED', payload: data }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'ASSIGNMENT_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, courseId, unitId, assignmentId, router ]);

  const uploadFile: UploadSlotFunction = useCallback((partId, uploadSlotId, file) => {
    if (!file) {
      return throwError(() => Error('file is not defined'));
    }
    dispatch({ type: 'FILE_UPLOAD_STARTED', payload: { partId, uploadSlotId } });
    return newAssignmentService.uploadFile(studentId, courseId, unitId, assignmentId, partId, uploadSlotId, file).pipe(
      tap({
        next: progressResponse => {
          if (progressResponse.type === 'progress') {
            dispatch({ type: 'FILE_UPLOAD_PROGRESSED', payload: { partId, uploadSlotId, progress: progressResponse.value } });
          } else if (progressResponse.type === 'data') {
            dispatch({ type: 'FILE_UPLOAD_SUCCEEDED', payload: { partId, uploadSlotId, filename: file.name, size: file.size } });
          }
        },
        error: err => {
          let message = 'File upload failed';
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin(router);
            }
            if (err.message) {
              message = err.message;
            }
          }
          dispatch({ type: 'FILE_UPLOAD_FAILED', payload: { partId, uploadSlotId } });
          alert(message);
        },
        // complete: () => dispatch({ type: 'FILE_UPLOAD_SUCCEEDED', payload: { partId, uploadSlotId, filename: file.name, size: file.size } }),
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, unitId, assignmentId, router ]);

  const deleteFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
    dispatch({ type: 'FILE_DELETE_STARTED', payload: { partId, uploadSlotId } });
    return newAssignmentService.deleteFile(studentId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
      tap({
        error: err => {
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin(router);
            }
          }
          dispatch({ type: 'FILE_DELETE_FAILED', payload: { partId, uploadSlotId } });
        },
        complete: () => dispatch({ type: 'FILE_DELETE_SUCCEEDED', payload: { partId, uploadSlotId } }),
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, unitId, assignmentId, router ]);

  const downloadFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
    return newAssignmentService.downloadFile(studentId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
      tap({
        error: err => {
          let message = 'File download failed';
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin(router);
            }
            if (err.message) {
              message = err.message;
            }
          }
          alert(message);
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, unitId, assignmentId, router ]);

  const saveText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    dispatch({ type: 'TEXT_SAVE_STARTED', payload: { partId, textBoxId } });
    return newAssignmentService.saveText(studentId, courseId, unitId, assignmentId, partId, textBoxId, text).pipe(
      tap({
        next: () => dispatch({ type: 'TEXT_SAVE_SUCCEEDED', payload: { partId, textBoxId, text } }),
        error: err => {
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin(router);
            }
          }
          dispatch({ type: 'TEXT_SAVE_FAILED', payload: { partId, textBoxId } });
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, unitId, assignmentId, router ]);

  const updateText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    return new Observable(obs => {
      dispatch({ type: 'TEXT_CHANGED', payload: { partId, textBoxId, text } });
      obs.next();
      obs.complete();
    });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.assignment) {
    return null;
  }

  const backButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    void router.back();
  };

  return (
    <>
      <section>
        <div className="container">
          {state.assignment.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {state.assignment.assignmentNumber}{state.assignment.title && <>: {state.assignment.title}</>}</h1>
          {state.assignment.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {state.assignment.newAssignmentMedia.map(m => (
                <figure key={m.assignmentMediumId} className="figure d-block">
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" studentId={studentId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
      {state.assignment.parts.map(p => (
        <NewPartForm
          key={p.partId}
          studentId={studentId}
          courseId={courseId}
          unitId={unitId}
          assignmentId={assignmentId}
          part={p}
          updateText={updateText}
          saveText={saveText}
          uploadFile={uploadFile}
          deleteFile={deleteFile}
          downloadFile={downloadFile}
        />
      ))}
      <section className="bg-dark text-light">
        <div className="container">
          {state.assignment.complete
            ? <p className="lead">All mandatory answers are complete!</p>
            : <p className="lead">Some mandatory answers are incomplete</p>
          }
          <button onClick={backButtonClick} className="btn btn-primary" disabled={state.assignment.saveState !== 'saved'}>Return to Unit Overview</button>
        </div>
      </section>
    </>
  );
};
