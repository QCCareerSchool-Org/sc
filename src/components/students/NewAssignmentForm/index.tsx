import { useRouter } from 'next/router';
import { MouseEventHandler, ReactElement, useCallback, useEffect, useReducer, useState } from 'react';
import { Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { ThemeProvider } from 'styled-components';
import { NewPartForm } from './NewPartForm';
import { initialState, reducer } from './state';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { ObservableHttpServiceError } from '@/services/observableHttpService';
import { newAssignmentService } from '@/services/students';

export type UploadSlotFunction = (partId: string, uploadSlotId: string, file?: File) => Observable<any>;
export type TextBoxFunction = (partId: string, textBoxId: string, text: string) => Observable<any>;

type Props = {
  studentId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentForm = ({ studentId, unitId, assignmentId }: Props): ReactElement | null => {
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
        if (err instanceof ObservableHttpServiceError) {
          if (err.refresh) {
            return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
          }
        }
        dispatch({ type: 'ASSIGNMENT_ERROR' });
      },
    });

    setUploadFile((): UploadSlotFunction => (partId, uploadSlotId, file) => {
      if (!file) {
        return throwError(() => Error('file is not defined'));
      }
      return newAssignmentService.uploadFile(studentId, unitId, assignmentId, partId, uploadSlotId, file).pipe(
        tap({
          next: progress => dispatch({ type: 'FILE_UPLOAD_PROGRESSED', payload: { partId, uploadSlotId, progress } }),
          error: err => {
            if (err instanceof ObservableHttpServiceError) {
              if (err.refresh) {
                return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
              }
            }
            dispatch({ type: 'FILE_ERRORED', payload: { partId, uploadSlotId } });
            alert('File upload failed');
          },
          complete: () => dispatch({ type: 'FILE_UPLOADED', payload: { partId, uploadSlotId, filename: file.name, size: file.size } }),
        }),
        takeUntil(destroy$),
      );
    });

    setDeleteFile((): UploadSlotFunction => (partId, uploadSlotId) => {
      return newAssignmentService.deleteFile(studentId, unitId, assignmentId, partId, uploadSlotId).pipe(
        tap({
          error: err => {
            if (err instanceof ObservableHttpServiceError) {
              if (err.refresh) {
                return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
              }
            }
            dispatch({ type: 'FILE_ERRORED', payload: { partId, uploadSlotId } });
          },
          complete: () => dispatch({ type: 'FILE_DELETED', payload: { partId, uploadSlotId } }),
        }),
        takeUntil(destroy$),
      );
    });

    setSaveText((): TextBoxFunction => (partId, textBoxId, text) => {
      dispatch({ type: 'TEXT_SAVE_REQUESTED', payload: { partId, textBoxId } });
      return newAssignmentService.saveText(studentId, unitId, assignmentId, partId, textBoxId, text).pipe(
        tap({
          next: () => dispatch({ type: 'TEXT_SAVED', payload: { partId, textBoxId, text } }),
          error: err => {
            if (err instanceof ObservableHttpServiceError) {
              if (err.refresh) {
                return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
              }
            }
            dispatch({ type: 'TEXT_ERRORED', payload: { partId, textBoxId } });
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
    void router.push(`/students/units/${unitId}`);
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
        <NewPartForm key={p.partId} part={p} state={state.assignmentState.partStates[i]} saveText={saveText} updateText={updateText} uploadFile={uploadFile} deleteFile={deleteFile} />
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
