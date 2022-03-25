import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, ReactElement } from 'react';
import { useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { SchoolList } from './SchoolList';
import { initialState, reducer } from './state';
import { Section } from '@/components/Section';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
};

export const CourseDevelopmentOverview = ({ administratorId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { schoolService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    schoolService.getSchools(administratorId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'SCHOOLS_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'SCHOOLS_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolService ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.schools) {
    return null;
  }

  const schoolRowClick = (e: MouseEvent<HTMLTableRowElement>, schoolId: number): void => {
    void router.push(`/administrators/schools/${schoolId}`);
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Course Development</h1>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Schools</h2>
          <SchoolList schools={state.schools} schoolRowClick={schoolRowClick} />
        </div>
      </Section>
    </>
  );
};
