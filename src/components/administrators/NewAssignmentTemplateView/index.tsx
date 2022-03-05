import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEvent, ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { NewPartForm } from './NewPartForm';
import { PartList } from './PartList';
import { initialState, reducer } from './state';
import { newAssignmentTemplateService, NewPartTemplatePayload, newPartTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

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

  const insert$ = useRef(new Subject<NewPartTemplatePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newAssignmentTemplateService.getAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: assignmentTemplate => {
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED', payload: assignmentTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'UNIT_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    // insert part
    insert$.current.pipe(
      tap(() => dispatch({ type: 'PART_ADD_STARTED' })),
      exhaustMap(payload => newPartTemplateService.addPart(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: insertedPart => dispatch({ type: 'PART_ADD_SUCCEEDED', payload: insertedPart }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'PART_ADD_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.assignmentTemplate) {
    return null;
  }

  const partRowClick = (e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`${router.asPath}/parts/${partId}`, undefined, { scroll: false });
  };

  const titleChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TITLE_CHANGED', payload: target.value });
  };

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: target.value });
  };

  const partNumberChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_NUMBER_CHANGED', payload: target.value });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_CHANGED', payload: target.checked });
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
              <NewPartForm
                formState={state.form}
                insert$={insert$.current}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                partNumberChange={partNumberChange}
                optionalChange={optionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
