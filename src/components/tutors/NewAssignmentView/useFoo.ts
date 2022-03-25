import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';
import type { Action } from './state';

import { useTutorServices } from '@/hooks/useTutorServices';

export const useFoo = (tutorId: number, studentId: number, courseId: number, unitId: string, assignmentId: string, dispatch: Dispatch<Action>): Subject<void> => {
  const router = useRouter();
  const { newAssignmentService } = useTutorServices();

  const foo$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    foo$.current.pipe(
      switchMap(() => {
        return newAssignmentService.getAssignment(tutorId, studentId, unitId, assignmentId).pipe(
          tap({
            next: newAssignment => {
              //
            },
            error: err => {
              //
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ tutorId, studentId, courseId, unitId, assignmentId, dispatch, router, newAssignmentService ]);

  return foo$.current;
};
