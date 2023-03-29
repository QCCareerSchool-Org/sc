import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): void => {
  const { newSubmissionService, studentService, tutorService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newSubmissionService.getSubmission(administratorId, submissionId).pipe(
      switchMap(newSubmission => forkJoin([
        studentService.getStudent(administratorId, newSubmission.enrollment.studentId),
        tutorService.getTutorsBySchool(administratorId, newSubmission.enrollment.course.schoolId),
      ]).pipe(
        map(([ student, tutors ]) => ({ newSubmission, student, tutors })),
      )),
      takeUntil(destroy$),
    ).subscribe({
      next: data => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: data });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, submissionId, newSubmissionService, studentService, tutorService, navigateToLogin ]);
};
