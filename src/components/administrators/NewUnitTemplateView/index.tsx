import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { initialState, reducer } from './state';
import { newUnitTemplateService } from '@/services/administrators';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
};

export const NewUnitTemplateView = ({ administratorId, schoolId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitTemplateService.getUnit(administratorId, schoolId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED', payload: schools });
      },
      error: err => {
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_FAILED' });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId, courseId, unitId ]);

  if (!state.unitTemplate) {
    return null;
  }

  const assignmentRowClick = (e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignments/${assignmentId}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>{state.unitTemplate.title}</h1>
          {state.unitTemplate.description
            ? <p className="lead">{state.unitTemplate.description}</p>
            : <p>no description</p>
          }
          <table className="table table-bordered w-auto">
            <tbody>
              <tr><th scope="row">Unit Letter</th><td>{state.unitTemplate.unitLetter}</td></tr>
              <tr><th scope="row">Course</th><td>{state.unitTemplate.course.name}</td></tr>
              <tr><th scope="row">Optional</th><td>{state.unitTemplate.optional ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Created</th><td>{formatDateTime(state.unitTemplate.created)}</td></tr>
              {state.unitTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.unitTemplate.modified)}</td></tr>}
            </tbody>
          </table>
          <h4>Assignments</h4>
          <table id="assignmentsTable" className="table table-bordered table-hover w-auto">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">Optional</th>
              </tr>
            </thead>
            <tbody>
              {state.unitTemplate.assignments.map(a => (
                <tr key={a.unitId} onClick={e => assignmentRowClick(e, a.assignmentId)}>
                  <td className="text-center">{a.assignmentNumber}</td>
                  <td>{a.title}</td>
                  <td className="text-center">{a.optional ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        #assignmentsTable tr { cursor: pointer }
      `}</style>
    </>
  );
};
