import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export interface SaveTutorNotePayload {
  tutorId: number;
  studentId: number;
  note: string | null;
}

export const useSaveTutorNote = (): Subject<SaveTutorNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useTutorServices();

  const SaveTutorNote$ = useRef(new Subject<SaveTutorNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    SaveTutorNote$.current.pipe(
      exhaustMap(({ tutorId, studentId, note }) => {
        return studentService.saveTutorNote(tutorId, studentId, note).pipe(
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
  return SaveTutorNote$.current;
};
