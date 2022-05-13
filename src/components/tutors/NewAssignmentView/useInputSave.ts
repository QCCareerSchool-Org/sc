import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, concatMap, EMPTY, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type InputType = 'text box' | 'upload slot';

export type MarkSavePayload = {
  inputType: InputType;
  tutorId: number;
  partId: string;
  id: string;
  mark: number | null;
  notes: string | null;
};

export const useInputSave = (dispatch: Dispatch<Action>): Subject<MarkSavePayload> => {
  const router = useRouter();
  const { newAssignmentService } = useTutorServices();

  const save$ = useRef(new Subject<MarkSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    save$.current.pipe(
      tap(({ inputType, partId, id }) => {
        if (inputType === 'text box') {
          dispatch({ type: 'SAVE_TEXT_BOX_STARTED', payload: { partId, textBoxId: id } });
        } else {
          dispatch({ type: 'SAVE_UPLOAD_SLOT_STARTED', payload: { partId, uploadSlotId: id } });
        }
      }),
      concatMap(payload => {
        const { inputType, tutorId, partId, id, mark, notes } = payload;
        if (inputType === 'text box') {
          return newAssignmentService.saveTextBox(tutorId, id, mark, notes).pipe(
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
        return newAssignmentService.saveUploadSlot(tutorId, id, mark, notes).pipe(
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

  return save$.current;
};
