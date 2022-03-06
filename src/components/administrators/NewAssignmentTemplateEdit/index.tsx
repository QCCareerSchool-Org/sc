import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEvent, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewAssignmentEditForm } from './NewAssignmentEditForm';
import { NewPartAddForm } from './NewPartAddForm';
import { PartList } from './PartList';
import { initialState, reducer, State } from './state';
import { NewAssignmentTemplatePayload, newAssignmentTemplateService, NewPartTemplatePayload, newPartTemplateService } from '@/services/administrators';
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

export const NewAssignmentTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewAssignmentTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());
  const partInsert$ = useRef(new Subject<{ processingState: State['partForm']['processingState']; payload: NewPartTemplatePayload }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newAssignmentTemplateService.getAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: assignmentTemplate => {
        dispatch({ type: 'ASSIGNMENT_TEMPLATE_LOAD_SUCCEEDED', payload: assignmentTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'ASSIGNMENT_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'ASSIGNMENT_TEMPLATE_SAVE_STARTED' })),
      exhaustMap(({ payload }) => newAssignmentTemplateService.saveAssignment(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'ASSIGNMENT_TEMPLATE_SAVE_SUCCEEDED', payload: updatedAssignment });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ASSIGNMENT_TEMPLATE_SAVE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'ASSIGNMENT_TEMPLATE_DELETE_STARTED' })),
      exhaustMap(() => newAssignmentTemplateService.deleteAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'ASSIGNMENT_TEMPLATE_DELETE_SUCCEEDED' });
            router.back();
          },
          error: err => {
            let message = 'Delete failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ASSIGNMENT_TEMPLATE_DELETE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    partInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_PART_STARTED' })),
      exhaustMap(({ payload }) => newPartTemplateService.addPart(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: insertedPart => dispatch({ type: 'ADD_PART_SUCCEEDED', payload: insertedPart }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_PART_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId ]);

  const titleChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TITLE_CHANGED', payload: target.value });
  }, []);

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: target.value });
  }, []);

  const assignmentNumberChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'ASSIGNMENT_NUMBER_CHANGED', payload: target.value });
  }, []);

  const optionalChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_CHANGED', payload: target.checked });
  }, []);

  const partRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`${router.asPath}/parts/${partId}`, undefined, { scroll: false });
  }, [ router ]);

  const partTitleChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_TITLE_CHANGED', payload: target.value });
  }, []);

  const partDescriptionChange: FormEventHandler<HTMLTextAreaElement> = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'PART_DESCRIPTION_CHANGED', payload: target.value });
  }, []);

  const partPartNumberChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_PART_NUMBER_CHANGED', payload: target.value });
  }, []);

  const partOptionalChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_OPTIONAL_CHANGED', payload: target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.assignmentTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Assignment</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentEditForm
                assignmentTemplate={state.assignmentTemplate}
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                assignmentNumberChange={assignmentNumberChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Unit</th><td>{state.assignmentTemplate.unit.title ?? state.assignmentTemplate.unit.unitLetter}</td></tr>
                  <tr><th scope="row">Parts</th><td>{state.assignmentTemplate.parts.length}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.assignmentTemplate.created)}</td></tr>
                  {state.assignmentTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.assignmentTemplate.modified)}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Parts</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <PartList parts={state.assignmentTemplate.parts} partRowClick={partRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartAddForm
                formState={state.partForm}
                insert$={partInsert$.current}
                titleChange={partTitleChange}
                descriptionChange={partDescriptionChange}
                partNumberChange={partPartNumberChange}
                optionalChange={partOptionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
