import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export interface SaveAdminNotePayload {
  administratorId: number;
  studentId: number;
  note: string | null;
}

export const useSaveNote = (): Subject<SaveAdminNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useAdminServices();

  const saveNote$ = useRef(new Subject<SaveAdminNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    saveNote$.current.pipe(
      exhaustMap(({ administratorId, studentId, note }) => {
        return studentService.saveAdminNote(administratorId, studentId, note).pipe(
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
