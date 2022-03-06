import NextError from 'next/error';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useCallback, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { AssignmentList } from './AssignmentList';
import { NewAssignmentAddForm } from './NewAssignmentAddForm';
import { NewUnitEditForm } from './NewUnitEditForm';
import { initialState, reducer } from './state';
import { newUnitTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

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
      next: unitTemplate => {
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED', payload: unitTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId ]);

  const assignmentRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignments/${assignmentId}`, undefined, { scroll: false });
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.unitTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Unit</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUnitEditForm />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Course</th><td>{state.unitTemplate.course.name}</td></tr>
                  <tr><th scope="row">Assignments</th><td>{state.unitTemplate.assignments.length}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.unitTemplate.created)}</td></tr>
                  {state.unitTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.unitTemplate.modified)}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Assignments</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <AssignmentList assignments={state.unitTemplate.assignments} assignmentRowClick={assignmentRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentAddForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
