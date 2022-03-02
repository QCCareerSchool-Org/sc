import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { AssignmentList } from './AssignmentList';
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
    void router.push(`${router.asPath}/assignments/${assignmentId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Unit: {state.unitTemplate.title}</h1>
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
          <Link href={`${router.asPath}/edit`} scroll={false}><a className="btn btn-primary">Edit Unit</a></Link>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Assignments</h2>
          <div className="row">
            <div className="col-12 col-xxl-6">
              <AssignmentList assignments={state.unitTemplate.assignments} assignmentRowClick={assignmentRowClick} />
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
