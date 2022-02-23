import { useRouter } from 'next/router';
import { MouseEventHandler, ReactElement, useCallback, useEffect, useReducer, useState } from 'react';
import { Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { NewPartForm } from './NewPartForm';
import { initialState, reducer } from './state';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { HttpServiceError } from '@/services/httpService';
import { newAssignmentService } from '@/services/students';
import { navigateToLogin } from 'src/navigateToLogin';

export type UploadSlotFunction = (partId: string, uploadSlotId: string, file?: File) => Observable<any>;
export type TextBoxFunction = (partId: string, textBoxId: string, text: string) => Observable<any>;

type Props = {
  studentId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentView = ({ studentId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  // we set these in the useEffect callback so that we have access to destroy$
  const [ uploadFile, setUploadFile ] = useState<UploadSlotFunction>();
  const [ deleteFile, setDeleteFile ] = useState<UploadSlotFunction>();
  const [ saveText, setSaveText ] = useState<TextBoxFunction>();

  useWarnIfUnsavedChanges(state.assignmentState.formState !== 'pristine' && state.assignmentState.saveState !== 'saved');

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentService.getAssignment(studentId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: data => dispatch({ type: 'ASSIGNMENT_LOADED', payload: data }),
      error: err => {
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
        }
        dispatch({ type: 'ASSIGNMENT_ERROR' });
      },
    });

    setUploadFile((): UploadSlotFunction => (partId, uploadSlotId, file) => {
      if (!file) {
        return throwError(() => Error('file is not defined'));
      }
      dispatch({ type: 'FILE_UPLOAD_STARTED', payload: { partId, uploadSlotId } });
      return newAssignmentService.uploadFile(studentId, unitId, assignmentId, partId, uploadSlotId, file).pipe(
        tap({
          next: progress => dispatch({ type: 'FILE_UPLOAD_PROGRESSED', payload: { partId, uploadSlotId, progress } }),
          error: err => {
            let message = 'File upload failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'FILE_UPLOAD_FAILED', payload: { partId, uploadSlotId } });
            alert(message);
          },
          complete: () => dispatch({ type: 'FILE_UPLOAD_SUCCEEDED', payload: { partId, uploadSlotId, filename: file.name, size: file.size } }),
        }),
        takeUntil(destroy$),
      );
    });

    setDeleteFile((): UploadSlotFunction => (partId, uploadSlotId) => {
      dispatch({ type: 'FILE_DELETE_STARTED', payload: { partId, uploadSlotId } });
      return newAssignmentService.deleteFile(studentId, unitId, assignmentId, partId, uploadSlotId).pipe(
        tap({
          error: err => {
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
            }
            dispatch({ type: 'FILE_DELETE_FAILED', payload: { partId, uploadSlotId } });
          },
          complete: () => dispatch({ type: 'FILE_DELETE_SUCCEEDED', payload: { partId, uploadSlotId } }),
        }),
        takeUntil(destroy$),
      );
    });

    setSaveText((): TextBoxFunction => (partId, textBoxId, text) => {
      dispatch({ type: 'TEXT_SAVE_STARTED', payload: { partId, textBoxId } });
      return newAssignmentService.saveText(studentId, unitId, assignmentId, partId, textBoxId, text).pipe(
        tap({
          next: () => dispatch({ type: 'TEXT_SAVE_SUCCEEDED', payload: { partId, textBoxId, text } }),
          error: err => {
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
            }
            dispatch({ type: 'TEXT_SAVE_FAILED', payload: { partId, textBoxId } });
          },
        }),
        takeUntil(destroy$),
      );
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, unitId, assignmentId, router ]);

  const updateText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    return new Observable(obs => {
      dispatch({ type: 'TEXT_CHANGED', payload: { partId, textBoxId, text } });
      obs.next();
      obs.complete();
    });
  }, []);

  const backButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    void router.push(`/students/units/${unitId}`, undefined, { scroll: false });
  };

  if (state.error) {
    return <>{state.error}</>;
  }

  if (!state.assignment || !saveText || !uploadFile || !deleteFile) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Assignment {state.assignment.assignmentNumber}{state.assignment.title && <>: {state.assignment.title}</>}</h1>
          {state.assignment.description && <p className="lead">{state.assignment.description}</p>}
        </div>
      </section>
      {state.assignment.parts.map((p, i) => (
        <NewPartForm key={p.partId} studentId={studentId} unitId={unitId} part={p} state={state.assignmentState.partStates[i]} saveText={saveText} updateText={updateText} uploadFile={uploadFile} deleteFile={deleteFile} />
      ))}
      <section className="bg-dark text-light">
        <div className="container">
          {state.assignment.complete
            ? <p className="lead">All mandatory answers are complete!</p>
            : <p className="lead">Some mandatory answers are incomplete</p>
          }
          <button onClick={backButtonClick} className="btn btn-primary" disabled={state.assignmentState.saveState !== 'saved'}>Return to Unit Overview</button>
        </div>
      </section>
    </>
  );
};
