import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewUploadSlotTemplateSavePayload } from '@/services/administrators/newUploadSlotTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewUploadSlotTemplateSaveEvent = {
  administratorId: number;
  uploadSlotId: string;
  payload: NewUploadSlotTemplateSavePayload;
  processingState: State['form']['processingState'];
};

export const useUploadSlotSave = (dispatch: Dispatch<Action>): Subject<NewUploadSlotTemplateSaveEvent> => {
  const { newUploadSlotTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const uploadSlotSave$ = useRef(new Subject<NewUploadSlotTemplateSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    uploadSlotSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, uploadSlotId, payload }) => {
        return newUploadSlotTemplateService.saveUploadSlot(administratorId, uploadSlotId, payload).pipe(
          tap({
            next: updatedUploadSlot => {
              dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: updatedUploadSlot });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUploadSlotTemplateService, navigateToLogin ]);

  return uploadSlotSave$.current;
};
