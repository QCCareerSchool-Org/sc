import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { initialState, reducer } from './state';
import { newAssignmentTemplateService } from '@/services/administrators';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentTemplateView = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentTemplateService.getAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
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
  }, [ administratorId, schoolId, courseId, unitId, assignmentId ]);

  if (!state.assignmentTemplate) {
    return null;
  }

  const partRowClick = (e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`${router.asPath}/parts/${partId}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>{state.assignmentTemplate.title}</h1>
          {state.assignmentTemplate.description
            ? <p className="lead">{state.assignmentTemplate.description}</p>
            : <p>no description</p>
          }
          <table className="table table-bordered w-auto">
            <tbody>
              <tr><th scope="row">Assignment Number</th><td>{state.assignmentTemplate.assignmentNumber}</td></tr>
              <tr><th scope="row">Unit</th><td>{state.assignmentTemplate.unit.title}</td></tr>
              <tr><th scope="row">Optional</th><td>{state.assignmentTemplate.optional ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Created</th><td>{formatDateTime(state.assignmentTemplate.created)}</td></tr>
              {state.assignmentTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.assignmentTemplate.modified)}</td></tr>}
            </tbody>
          </table>
          <h4>Parts</h4>
          <table id="partsTable" className="table table-bordered table-hover w-auto">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>Title</th>
                <th className="text-center">Optional</th>
              </tr>
            </thead>
            <tbody>
              {state.assignmentTemplate.parts.map(p => (
                <tr key={p.partId} onClick={e => partRowClick(e, p.partId)}>
                  <td className="text-center">{p.partNumber}</td>
                  <td>{p.title}</td>
                  <td className="text-center">{p.optional ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        #partsTable tr { cursor: pointer }
      `}</style>
    </>
  );
};
