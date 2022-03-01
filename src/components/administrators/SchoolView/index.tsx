import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';
import { initialState, reducer } from './state';
import { schoolService } from '@/services/administrators';

type Props = {
  administratorId: number;
  schoolId: number;
};

export const SchoolView = ({ administratorId, schoolId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    schoolService.getSchool(administratorId, schoolId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'SCHOOL_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        dispatch({ type: 'SCHOOL_LOAD_FAILED' });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId ]);

  if (!state.school) {
    return null;
  }

  const courseRowClick = (e: MouseEvent<HTMLTableRowElement>, courseId: number): void => {
    void router.push(`${router.asPath}/courses/${courseId}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>{state.school.name}</h1>
          <h4>Courses</h4>
          <table id="coursesTable" className="table table-bordered table-hover w-auto">
            <thead>
              <tr>
                <th className="text-center">Code</th>
                <th>Name</th>
                <th className="text-center">Version</th>
              </tr>
            </thead>
            <tbody>
              {state.school.courses.map(c => (
                <tr key={c.courseId} onClick={e => courseRowClick(e, c.courseId)}>
                  <td className="text-center">{c.code}</td>
                  <td>{c.name}</td>
                  <td className="text-center">{c.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        #coursesTable tr { cursor: pointer }
      `}</style>
    </>
  );
};
