import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { endpoint } from '../../../basePath';
import { navigateToLogin } from '../../../navigateToLogin';
import { scrollToId } from '../../../scrollToId';
import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartForm } from './NewPartForm';
import { initialState, reducer } from './state';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { useStudentServices } from '@/hooks/useStudentServices';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { HttpServiceError } from '@/services/httpService';

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
  const { newAssignmentService } = useStudentServices();
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
  }, [ studentId, courseId, unitId, assignmentId, router, newAssignmentService ]);

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
  }, [ studentId, courseId, unitId, assignmentId, router, newAssignmentService ]);

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
  }, [ studentId, courseId, unitId, assignmentId, router, newAssignmentService ]);

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
  }, [ studentId, courseId, unitId, assignmentId, router, newAssignmentService ]);

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
  }, [ studentId, courseId, unitId, assignmentId, router, newAssignmentService ]);

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

  const handleBackButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    void router.back();
  };

  const handleIncompletePartClick = (e: MouseEvent, partId: string): void => {
    e.preventDefault();
    scrollToId(partId);
  };

  return (
    <>
      <Section>
        <div className="container">
          {state.assignment.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {state.assignment.assignmentNumber}{state.assignment.title && <>: {state.assignment.title}</>}</h1>
          {state.assignment.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {state.assignment.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" studentId={studentId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {state.assignment.newAssignmentMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignments/${assignmentId}/media/${m.assignmentMediumId}/file`;
                return (
                  <div key={m.assignmentMediumId} className="downloadMedium">
                    <a href={href} download>
                      <DownloadMedium medium={m} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
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
      <Section className="bg-dark text-light">
        <div className="container">
          {state.assignment.complete && <p className="lead">All required parts are complete!</p>}
          {!state.assignment.complete && (
            <div className="mb-4">
              <p className="lead mb-2">Some required parts are incomplete:</p>
              <ul className="ps-3">
                {state.assignment.parts.filter(p => !p.complete).map(p => (
                  // we don't use an anchor link because we don't want the history to change
                  <li key={p.partId}><a onClick={e => handleIncompletePartClick(e, p.partId)} href={`#${p.partId}`} className="link-light text-decoration-none">{p.title}</a></li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleBackButtonClick} className="btn btn-primary" disabled={state.assignment.saveState !== 'saved'}>Return to Unit Overview</button>
        </div>
      </Section>
      <style jsx>{`
      .downloadMedium {
        margin-bottom: 1rem;
      }
      .downloadMedium:last-of-type {
        margin-bottom: 0;
      }
      .downloadMedium a {
        text-decoration: none;
        color: inherit;
      }
      `}</style>
    </>
  );
};
