import { useEffect } from 'react';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

import { useServices } from './useServices';

// const defaultInterval = 1_500_000; // 25 minutes in milliseconds
const defaultInterval = 60_000; // 60 seconds in milliseconds

export const useStayLoggedIn = (refreshInterval = defaultInterval): void => {
  const { loginService } = useServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    const intervalId = setInterval(() => {
      loginService.refresh().pipe(
        catchError(() => EMPTY),
        takeUntil(destroy$),
      ).subscribe();
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
      destroy$.next();
      destroy$.complete();
    };
  }, [ refreshInterval, loginService ]);
};
