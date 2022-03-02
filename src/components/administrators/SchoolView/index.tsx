import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';
import { CourseList } from './CourseList';
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
    void router.push(`${router.asPath}/courses/${courseId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>School: {state.school.name}</h1>
          <CourseList courses={state.school.courses} courseRowClick={courseRowClick} />
        </div>
      </section>
    </>
  );
};
