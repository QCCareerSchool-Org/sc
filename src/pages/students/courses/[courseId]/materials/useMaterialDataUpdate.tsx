import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { catchError, concatMap, EMPTY, Subject, takeUntil, tap } from 'rxjs';

import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

interface MaterialDataUpdateEvent {
  studentId: number;
  materialId: string;
  data: Record<string, string>;
}

export const useMaterialDataUpdate = (commitFailure$: Subject<void>): Subject<MaterialDataUpdateEvent> => {
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const { materialService } = useStudentServices();

  const materialDataUpdate$ = useRef(new Subject<MaterialDataUpdateEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialDataUpdate$.current.pipe(
      concatMap(({ studentId, materialId, data }) => materialService.updateMaterialData(studentId, materialId, data).pipe(
        tap({
          error: err => {
            commitFailure$.next();
            if (err instanceof HttpServiceError) {
              if (err.login) {
                navigateToLogin();
              }
            }
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ materialService, router, navigateToLogin, commitFailure$ ]);

  // eslint-disable-next-line react-hooks/refs
  return materialDataUpdate$.current;
};
