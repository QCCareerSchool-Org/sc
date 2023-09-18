import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useAudioProgress = (dispatch: Dispatch<Action>, studentId: number, courseId: number, submissionId: string): Subject<number> => {
  const { newSubmissionService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const skip$ = useRef(new Subject<number>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    skip$.current.pipe(
      exhaustMap(progress => newSubmissionService.updateResponseProgress(studentId, courseId, submissionId, progress).pipe(
        tap({
          next: () => dispatch({ type: 'AUDIO_PROGRESSED', payload: progress }),
          error: err => {
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
            }
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentId, courseId, submissionId, newSubmissionService, navigateToLogin ]);

  return skip$.current;
};
