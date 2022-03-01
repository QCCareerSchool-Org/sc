import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { initialState, reducer } from './state';
import { schoolService } from '@/services/administrators';

type Props = {
  administratorId: number;
};

export const SchoolList = ({ administratorId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    schoolService.getSchools(administratorId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'SCHOOLS_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        dispatch({ type: 'SCHOOLS_LOAD_FAILED' });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId ]);

  if (!state.schools) {
    return null;
  }

  const schoolRowClick = (e: MouseEvent<HTMLTableRowElement>, schoolId: number): void => {
    void router.push(`${router.asPath}/${schoolId}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>School List</h1>
          <table id="schoolTable" className="table table-bordered table-hover w-auto">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {state.schools.map(s => (
                <tr key={s.schoolId} onClick={e => schoolRowClick(e, s.schoolId)}>
                  <td>{s.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        #schoolTable tr { cursor: pointer }
      `}</style>
    </>
  );
};
