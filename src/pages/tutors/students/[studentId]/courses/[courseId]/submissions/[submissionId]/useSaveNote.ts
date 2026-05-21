import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export interface SaveNotePayload {
  tutorId: number;
  studentId: number;
  note: string | null;
}

export const useSaveNote = (): Subject<SaveNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useTutorServices();

  const saveNote$ = useRef(new Subject<SaveNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    saveNote$.current.pipe(
      exhaustMap(({ tutorId, studentId, note }) => {
        return studentService.saveNote(tutorId, studentId, note).pipe(
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
  }, [ studentService, navigateToLogin ]);

  // eslint-disable-next-line react-hooks/refs
  return saveNote$.current;
};
