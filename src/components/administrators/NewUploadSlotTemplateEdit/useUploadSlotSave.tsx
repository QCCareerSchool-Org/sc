import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewUploadSlotTemplatePayload } from '@/services/administrators/newUploadSlotTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type UploadSlotSavePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  uploadSlotId: string;
  processingState: State['form']['processingState'];
  payload: NewUploadSlotTemplatePayload;
};

export const useUploadSlotSave = (dispatch: Dispatch<Action>): Subject<UploadSlotSavePayload> => {
  const router = useRouter();
  const { newUploadSlotTemplateService } = useAdminServices();

  const uploadSlotSave$ = useRef(new Subject<UploadSlotSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    uploadSlotSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, payload }) => {
        return newUploadSlotTemplateService.saveUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, payload).pipe(
          tap({
            next: updatedUploadSlot => {
              dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: updatedUploadSlot });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
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
  }, [ dispatch, router, newUploadSlotTemplateService ]);

  return uploadSlotSave$.current;
};
