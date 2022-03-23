import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';
import type { Action } from './state';

import { HttpServiceError } from '@/services/httpService';
import { newAssignmentService } from '@/services/tutors';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (tutorId: number, studentId: number, courseId: number, unitId: string, assignmentId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentService.getAssignment(tutorId, studentId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignment => {
        dispatch({ type: 'LOAD_ASSIGNMENT_SUCCEEDED', payload: newAssignment });
        console.log('here');
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ tutorId, studentId, courseId, unitId, assignmentId, dispatch, router ]);
};
