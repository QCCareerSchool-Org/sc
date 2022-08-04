import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type FeedbackUploadPayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  file: File;
  processingState: State['processingState'];
};

export const useFeedbackUpload = (dispatch: Dispatch<Action>): Subject<FeedbackUploadPayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { newUnitService } = useTutorServices();

  const feedbackUpload$ = useRef(new Subject<FeedbackUploadPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    feedbackUpload$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'delete error' || processingState === 'close error' || processingState === 'return error'),
      tap(() => dispatch({ type: 'UPLOAD_FEEDBACK_STARTED' })),
      exhaustMap(({ tutorId, studentId, unitId, file }) => {
        return newUnitService.uploadFeedback(tutorId, studentId, unitId, file).pipe(
          tap({
            next: progressResponse => {
              if (progressResponse.type === 'progress') {
                dispatch({ type: 'UPLOAD_FEEDBACK_PROGRESSED', payload: progressResponse.value });
              } else {
                dispatch({ type: 'UPLOAD_FEEDBACK_SUCCEEDED', payload: progressResponse.value });
              }
            },
            error: err => {
              let message = 'Upload failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'UPLOAD_FEEDBACK_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitService, navigateToLogin ]);

  return feedbackUpload$.current;
};
