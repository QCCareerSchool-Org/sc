import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { initialState, reducer } from './state';
import { courseService } from '@/services/administrators';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
};

export const CourseView = ({ administratorId, schoolId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, schoolId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'COURSE_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        dispatch({ type: 'COURSE_LOAD_FAILED' });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId, courseId ]);

  if (!state.course) {
    return null;
  }

  const unitRowClick = (e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(`${router.asPath}/newUnitTemplates/${unitId}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>{state.course.name}</h1>
          <table className="table table-bordered w-auto">
            <tbody>
              <tr><th scope="row">Code</th><td>{state.course.code}</td></tr>
              <tr><th scope="row">Version</th><td>{state.course.version}</td></tr>
              <tr><th scope="row">School</th><td>{state.course.school.name}</td></tr>
              <tr><th scope="row">Course Guide</th><td>{state.course.courseGuide ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Quizzes Enabled</th><td>{state.course.quizzesEnabled ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">No Tutor</th><td>{state.course.noTutor ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Unit Type</th><td>{state.course.unitType}</td></tr>
            </tbody>
          </table>
          <h4>Units</h4>
          <table id="unitsTable" className="table table-bordered table-hover w-auto">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">Optional</th>
              </tr>
            </thead>
            <tbody>
              {state.course.newUnitTemplates.map(u => (
                <tr key={u.unitId} onClick={e => unitRowClick(e, u.unitId)}>
                  <td className="text-center">{u.unitLetter}</td>
                  <td>{u.title}</td>
                  <td className="text-center">{u.optional ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        #unitsTable tr { cursor: pointer }
      `}</style>
    </>
  );
};
