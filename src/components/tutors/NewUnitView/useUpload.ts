import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { HttpServiceError } from '@/services/httpService';
import { newUnitService } from '@/services/tutors';
import { navigateToLogin } from 'src/navigateToLogin';

export type UploadPayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  file: File;
  processingState: State['processingState'];
};

export const useUpload = (dispatch: Dispatch<Action>): Subject<UploadPayload> => {
  const router = useRouter();

  const upload$ = useRef(new Subject<UploadPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    upload$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'close error' || processingState === 'return error'),
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
                  return void navigateToLogin(router);
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
  }, [ dispatch, router ]);

  return upload$.current;
};
