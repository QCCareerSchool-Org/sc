import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, concatMap, EMPTY, Subject, takeUntil, tap } from 'rxjs';
import type { Action } from './state';

import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type MarkSavePayload = {
  type: 'textBox' | 'uploadSlot';
  tutorId: number;
  partId: string;
  id: string;
  mark: number | null;
};

export const useMarkSave = (dispatch: Dispatch<Action>): Subject<MarkSavePayload> => {
  const router = useRouter();
  const { newAssignmentService } = useTutorServices();

  const markSave$ = useRef(new Subject<MarkSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    markSave$.current.pipe(
      tap(({ type, partId, id }) => {
        if (type === 'textBox') {
          dispatch({ type: 'SAVE_TEXT_BOX_STARTED', payload: { partId, textBoxId: id } });
        } else {
          dispatch({ type: 'SAVE_UPLOAD_SLOT_STARTED', payload: { partId, uploadSlotId: id } });
        }
      }),
      concatMap(payload => {
        const { type, tutorId, partId, id, mark } = payload;
        if (type === 'textBox') {
          return newAssignmentService.saveTextBoxMark(tutorId, id, mark).pipe(
            tap({
              next: newTextBox => dispatch({ type: 'SAVE_TEXT_BOX_SUCCEEDED', payload: newTextBox }),
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
                dispatch({ type: 'SAVE_TEXT_BOX_FAILED', payload: { partId, textBoxId: id, message } });
              },
            }),
            catchError(() => EMPTY),
          );
        }
        return newAssignmentService.saveUploadSlotMark(tutorId, id, mark).pipe(
          tap({
            next: newUploadSlot => dispatch({ type: 'SAVE_UPLOAD_SLOT_SUCCEEDED', payload: newUploadSlot }),
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
              dispatch({ type: 'SAVE_UPLOAD_SLOT_FAILED', payload: { partId, uploadSlotId: id, message } });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newAssignmentService ]);

  return markSave$.current;
};
