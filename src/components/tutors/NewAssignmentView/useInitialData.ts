import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';
import type { Action } from './state';

import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, tutorId: number, studentId: number, courseId: number, unitId: string, assignmentId: string): void => {
  const navigateToLogin = useNavigateToLogin();
  const { newAssignmentService } = useTutorServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentService.getAssignment(tutorId, studentId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignment => {
        dispatch({ type: 'LOAD_ASSIGNMENT_SUCCEEDED', payload: newAssignment });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, tutorId, studentId, courseId, unitId, assignmentId, newAssignmentService, navigateToLogin ]);
};
