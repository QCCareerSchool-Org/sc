import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { PartList } from './PartList';
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
    void router.push(`${router.asPath}/parts/${partId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Assignment: {state.assignmentTemplate.title}</h1>
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
          <Link href={`${router.asPath}/edit`} scroll={false}><a className="btn btn-primary">Edit Assignment</a></Link>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Parts</h2>
          <div className="row">
            <div className="col-12 col-xxl-6">
              <PartList parts={state.assignmentTemplate.parts} partRowClick={partRowClick} />
            </div>
            <div className="col-12 col-xxl-6 mb-3 mb-xxl-0">
              .
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
