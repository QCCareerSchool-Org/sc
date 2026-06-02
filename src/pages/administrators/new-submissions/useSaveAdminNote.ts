import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export interface SaveAdminNotePayload {
  studentId: number;
  note: string | null;
}

export const useSaveAdminNote = (administratorId: number): Subject<SaveAdminNotePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useAdminServices();

  const saveAdminNote$ = useRef(new Subject<SaveAdminNotePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    saveAdminNote$.current.pipe(
      exhaustMap(({ studentId, note }) => {
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
  }, [ administratorId, studentService, navigateToLogin ]);

  // eslint-disable-next-line react-hooks/refs
  return saveAdminNote$.current;
};
