import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ChangeEventHandler, MouseEvent, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewAssignmentTemplateAddForm } from './NewAssignmentTemplateAddForm';
import { NewAssignmentTemplateList } from './NewAssignmentTemplateList';
import { NewUnitTemplateEditForm } from './NewUnitTemplateEditForm';
import { initialState, reducer, State } from './state';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { newAssignmentTemplateService, newUnitTemplateService } from '@/services/administrators';
import type { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';
import type { NewUnitTemplatePayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
};

const changesPreset = (unitTemplate: NewUnitTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!unitTemplate) {
    return false;
  }
  if (unitTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (unitTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (unitTemplate.unitLetter !== formData.unitLetter) {
    return true;
  }
  if (unitTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewUnitTemplateEdit = ({ administratorId, schoolId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.unitTemplate, state.form.data));

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewUnitTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());
  const assignmentInsert$ = useRef(new Subject<{ processingState: State['assignmentForm']['processingState']; payload: NewAssignmentTemplatePayload }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newUnitTemplateService.getUnit(administratorId, schoolId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unitTemplate => {
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_SUCCEEDED', payload: unitTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newUnitTemplateService.saveUnit(administratorId, schoolId, courseId, unitId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
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
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(() => newUnitTemplateService.deleteUnit(administratorId, schoolId, courseId, unitId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_UNIT_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    assignmentInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newAssignmentTemplateService.addAssignment(administratorId, schoolId, courseId, unitId, payload).pipe(
        tap({
          next: insertedAssignment => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: insertedAssignment }),
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
            dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId ]);

  const titleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const unitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  const optionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const assignmentRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignments/${assignmentId}`, undefined, { scroll: false });
  }, [ router ]);

  const assignmentTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const assignmentDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentAssignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

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
          <h1>Edit Unit Template</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUnitTemplateEditForm
                unitTemplate={state.unitTemplate}
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                unitLetterChange={unitLetterChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Course</th><td>{state.unitTemplate.course.name}</td></tr>
                  <tr><th scope="row">Assignments</th><td>{state.unitTemplate.newAssignmentTemplates.length}</td></tr>
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
          <h2 className="h3">Assignment Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewAssignmentTemplateList assignments={state.unitTemplate.newAssignmentTemplates} assignmentRowClick={assignmentRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentTemplateAddForm
                formState={state.assignmentForm}
                insert$={assignmentInsert$.current}
                titleChange={assignmentTitleChange}
                descriptionChange={assignmentDescriptionChange}
                assignmentNumberChange={assignmentAssignmentNumberChange}
                optionalChange={assignmentOptionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
