import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type NewUploadSlotTemplateDeleteEvent = {
  administratorId: number;
  uploadSlotId: string;
  processingState: State['form']['processingState'];
};

export const useUploadSlotDelete = (dispatch: Dispatch<Action>): Subject<NewUploadSlotTemplateDeleteEvent> => {
  const router = useRouter();
  const { newUploadSlotTemplateService } = useAdminServices();

  const uploadSlotDelete$ = useRef(new Subject<NewUploadSlotTemplateDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    uploadSlotDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, uploadSlotId }) => {
        return newUploadSlotTemplateService.deleteUploadSlot(administratorId, uploadSlotId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED' });
              router.back();
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUploadSlotTemplateService ]);

  return uploadSlotDelete$.current;
};
