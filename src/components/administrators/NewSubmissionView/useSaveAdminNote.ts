import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export interface SaveAdminNotePayload {
  studentId: number;
  note: string | null;
}

export const useSaveAdminNote = (administratorId: number, dispatch: Dispatch<Action>): Subject<SaveAdminNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useAdminServices();

  const saveAdminNote$ = useRef(new Subject<SaveAdminNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    saveAdminNote$.current.pipe(
      tap(() => dispatch({ type: 'ADMIN_NOTE_SAVE_STARTED' })),
      exhaustMap(({ studentId, note }) => {
        return studentService.saveAdminNote(administratorId, studentId, note).pipe(
          tap({
            next: () => dispatch({ type: 'ADMIN_NOTE_SAVE_SUCCEEDED' }),
          }),
          catchError(err => {
            dispatch({ type: 'ADMIN_NOTE_SAVE_FAILED', payload: 'Failed to save admin note' });
            if (err instanceof HttpServiceError && err.login) {
              navigateToLogin();
            }
            return EMPTY;
          }),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, studentService, navigateToLogin, dispatch ]);

  // eslint-disable-next-line react-hooks/refs
  return saveAdminNote$.current;
};
