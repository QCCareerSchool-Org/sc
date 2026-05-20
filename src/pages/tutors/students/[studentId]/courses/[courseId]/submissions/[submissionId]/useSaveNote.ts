import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export interface SaveNotePayload {
  tutorId: number;
  studentId: number;
  note: string | null;
}

export const useSaveNote = (dispatch: Dispatch<Action>): Subject<SaveNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { newSubmissionService } = useTutorServices();

  const saveNote$ = useRef(new Subject<SaveNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    saveNote$.current.pipe(
      exhaustMap(({ tutorId, studentId, note }) => {
        return newSubmissionService.saveNote(tutorId, studentId, note).pipe(
          tap({
            error: err => {
              if (err instanceof HttpServiceError && err.login) {
                navigateToLogin();
              }
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ newSubmissionService, navigateToLogin ]);

  // eslint-disable-next-line react-hooks/refs
  return saveNote$.current;
};
