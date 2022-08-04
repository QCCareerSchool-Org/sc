import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type FeedbackDeletePayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
};

export const useFeedbackDelete = (dispatch: Dispatch<Action>): Subject<FeedbackDeletePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { newUnitService } = useTutorServices();

  const feedbackDelete$ = useRef(new Subject<FeedbackDeletePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    feedbackDelete$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'delete error' || processingState === 'close error' || processingState === 'return error'),
      tap(() => dispatch({ type: 'DELETE_FEEDBACK_STARTED' })),
      exhaustMap(({ tutorId, studentId, unitId }) => {
        return newUnitService.deleteFeedback(tutorId, studentId, unitId).pipe(
          tap({
            next: newUnit => {
              dispatch({ type: 'DELETE_FEEDBACK_SUCCEEDED', payload: newUnit });
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_FEEDBACK_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitService, navigateToLogin ]);

  return feedbackDelete$.current;
};
