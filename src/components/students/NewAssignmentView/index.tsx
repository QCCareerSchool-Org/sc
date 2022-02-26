import { useRouter } from 'next/router';
import { useCallback, useEffect, useReducer } from 'react';
import type { ReactElement } from 'react';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';

import { initialState, reducer } from './state';
import { View } from './View';
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

  useWarnIfUnsavedChanges(state.assignment && state.assignment?.formState !== 'pristine' && state.assignment?.saveState !== 'saved');

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

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, unitId, assignmentId, router ]);

  const uploadFile: UploadSlotFunction = useCallback((partId, uploadSlotId, file) => {
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
      catchError(() => EMPTY),
    );
  }, [ studentId, unitId, assignmentId, router ]);

  const deleteFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
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
      catchError(() => EMPTY),
    );
  }, [ studentId, unitId, assignmentId, router ]);

  const downloadFile: UploadSlotFunction = useCallback((partId, uploadSlotId) => {
    return newAssignmentService.downloadFile(studentId, unitId, assignmentId, partId, uploadSlotId).pipe(
      tap({
        error: err => {
          let message = 'File download failed';
          if (err instanceof HttpServiceError) {
            if (err.refresh) {
              return navigateToLogin(router);
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
  }, [ studentId, unitId, assignmentId, router ]);

  const saveText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
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
      catchError(() => EMPTY),
    );
  }, [ studentId, unitId, assignmentId, router ]);

  const updateText: TextBoxFunction = useCallback((partId, textBoxId, text) => {
    return new Observable(obs => {
      dispatch({ type: 'TEXT_CHANGED', payload: { partId, textBoxId, text } });
      obs.next();
      obs.complete();
    });
  }, []);

  if (state.error) {
    return <>{state.error}</>;
  }

  return <View
    state={state}
    updateText={updateText}
    saveText={saveText}
    uploadFile={uploadFile}
    deleteFile={deleteFile}
    downloadFile={downloadFile}
  />;
};
