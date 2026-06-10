import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export interface SaveTutorNotePayload {
  tutorId: number;
  studentId: number;
  note: string | null;
}

export const useSaveTutorNote = (dispatch: Dispatch<Action>): Subject<SaveTutorNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useTutorServices();

  const SaveTutorNote$ = useRef(new Subject<SaveTutorNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    SaveTutorNote$.current.pipe(
      tap(() => dispatch({ type: 'TUTOR_NOTE_SAVE_STARTED' })),
      exhaustMap(({ tutorId, studentId, note }) => {
        return studentService.saveTutorNote(tutorId, studentId, note).pipe(
          tap({
            next: () => dispatch({ type: 'TUTOR_NOTE_SAVE_SUCCEEDED' }),
          }),
          catchError(err => {
            dispatch({ type: 'TUTOR_NOTE_SAVE_FAILED', payload: 'Failed to save tutor note' });
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
  }, [ studentService, navigateToLogin, dispatch ]);

  // eslint-disable-next-line react-hooks/refs
  return SaveTutorNote$.current;
};
