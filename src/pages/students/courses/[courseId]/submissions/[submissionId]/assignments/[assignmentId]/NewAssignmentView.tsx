import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { FC, MouseEvent, MouseEventHandler } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartForm } from './NewPartForm';
import { initialState, reducer } from './state';
import { Description } from '@/components/Description';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { HttpServiceError } from '@/services/httpService';
import { endpoint } from 'src/basePath';
import { scrollToId } from 'src/scrollToId';

export type UploadSlotFunction = (partId: string, uploadSlotId: string, file?: File) => Observable<unknown>;
export type TextBoxFunction = (partId: string, textBoxId: string, text: string) => Observable<unknown>;

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
  assignmentId: string;
};

export const NewAssignmentView: FC<Props> = ({ studentId, courseId, submissionId, assignmentId }) => {
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const { newAssignmentService } = useStudentServices();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(state.assignment && state.assignment?.formState !== 'pristine' && state.assignment?.saveState !== 'saved');

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentService.getAssignment(studentId, courseId, submissionId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: data => dispatch({ type: 'ASSIGNMENT_LOAD_SUCCEEDED', payload: data }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'ASSIGNMENT_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, courseId, submissionId, assignmentId, newAssignmentService, navigateToLogin ]);

  const uploadFile: UploadSlotFunction = useCallback((partId, uploadSlotId, file) => {
    if (!file) {
      return throwError(() => Error('file is not defined'));
    }
    dispatch({ type: 'FILE_UPLOAD_STARTED', payload: { partId, uploadSlotId } });
    return newAssignmentService.uploadFile(studentId, courseId, submissionId, assignmentId, partId, uploadSlotId, file).pipe(
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
              return void navigateToLogin();
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
  }, [ studentId, courseId, submissionId, assignmentId, newAssignmentService, navigateToLogin ]);

  const deleteFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
    dispatch({ type: 'FILE_DELETE_STARTED', payload: { partId, uploadSlotId } });
    return newAssignmentService.deleteFile(studentId, courseId, submissionId, assignmentId, partId, uploadSlotId).pipe(
      tap({
        error: err => {
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin();
            }
          }
          dispatch({ type: 'FILE_DELETE_FAILED', payload: { partId, uploadSlotId } });
        },
        complete: () => dispatch({ type: 'FILE_DELETE_SUCCEEDED', payload: { partId, uploadSlotId } }),
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, submissionId, assignmentId, newAssignmentService, navigateToLogin ]);

  const downloadFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
    return newAssignmentService.downloadFile(studentId, courseId, submissionId, assignmentId, partId, uploadSlotId).pipe(
      tap({
        error: err => {
          let message = 'File download failed';
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin();
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
  }, [ studentId, courseId, submissionId, assignmentId, newAssignmentService, navigateToLogin ]);

  const saveText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    dispatch({ type: 'TEXT_SAVE_STARTED', payload: { partId, textBoxId } });
    return newAssignmentService.saveText(studentId, courseId, submissionId, assignmentId, partId, textBoxId, text).pipe(
      tap({
        next: () => dispatch({ type: 'TEXT_SAVE_SUCCEEDED', payload: { partId, textBoxId, text } }),
        error: err => {
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin();
            }
          }
          dispatch({ type: 'TEXT_SAVE_FAILED', payload: { partId, textBoxId } });
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ studentId, courseId, submissionId, assignmentId, newAssignmentService, navigateToLogin ]);

  const updateText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    return new Observable<void>(obs => {
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

  const assignment = state.assignment;

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
          {assignment.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {assignment.assignmentNumber}{assignment.title && <>: {assignment.title}</>}</h1>
          {assignment.newSubmission.submitted === null && assignment.newSubmission.hasParent && (
            <div className="alert alert-danger mt-3" role="alert">
              This submission is a redo. Be sure to carefully review the audio feedback your tutor provided for your previous submission, and make the necessary changes to your assignments before resubmitting this unit to your tutor.
            </div>
          )}
          {assignment.description && <Description description={assignment.description} descriptionType={assignment.descriptionType} />}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {assignment.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" studentId={studentId} courseId={courseId} submissionId={submissionId} assignmentId={assignmentId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {assignment.newAssignmentMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${submissionId}/assignments/${assignmentId}/media/${m.assignmentMediumId}/file`;
                const handleDownloadClick: MouseEventHandler = e => {
                  e.preventDefault();
                  newAssignmentService.downloadAssignmentMedia(studentId, courseId, submissionId, assignmentId, m.assignmentMediumId).pipe(
                    catchError(() => EMPTY),
                  ).subscribe();
                };
                return (
                  <div key={m.assignmentMediumId} className="downloadMedium">
                    <a href={href} download={m.filename} onClick={handleDownloadClick}>
                      <DownloadMedium medium={m} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
      {assignment.parts.map(p => (
        <NewPartForm
          key={p.partId}
          studentId={studentId}
          courseId={courseId}
          submissionId={submissionId}
          assignmentId={assignmentId}
          part={p}
          locked={assignment.newSubmission.submitted !== null}
          updateText={updateText}
          saveText={saveText}
          uploadFile={uploadFile}
          deleteFile={deleteFile}
          downloadFile={downloadFile}
        />
      ))}
      <Section className="bg-dark text-light">
        <div className="container">
          {assignment.complete && <p className="lead">All required parts are complete!</p>}
          {!assignment.complete && (
            <div className="mb-4">
              <p className="lead mb-2">Some required parts are incomplete:</p>
              <ul className="ps-3">
                {assignment.parts.filter(p => !p.complete).map(p => (
                  // we don't use an anchor link because we don't want the history to change
                  <li key={p.partId}><a onClick={e => handleIncompletePartClick(e, p.partId)} href={`#${p.partId}`} className="link-light text-decoration-none">{p.title}</a></li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleBackButtonClick} className="btn btn-primary" disabled={assignment.saveState !== 'saved'}>Return to Unit Overview</button>
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
