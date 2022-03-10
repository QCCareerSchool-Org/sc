import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEventHandler, MouseEvent, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewAssignmentMediumAddForm } from './NewAssignmentMediumAddForm';
import { NewAssignmentMediumList } from './NewAssignmentMediumList';
import { NewAssignmentTemplateEditForm } from './NewAssignmentTemplateEditForm';
import { NewPartTemplateAddForm } from './NewPartTemplateAddForm';
import { NewPartTemplateList } from './NewPartTemplateList';
import { initialState, reducer, State } from './state';
import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { newAssignmentMediumService, newAssignmentTemplateService, newPartTemplateService } from '@/services/administrators';
import type { NewAssignmentMediumPayload } from '@/services/administrators/newAssignmentMediumService';
import type { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';
import type { NewPartTemplatePayload } from '@/services/administrators/newPartTemplateService';
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

const changesPreset = (assignmentTemplate: NewAssignmentTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!assignmentTemplate) {
    return false;
  }
  if (assignmentTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (assignmentTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (assignmentTemplate.assignmentNumber !== parseInt(formData.assignmentNumber, 10)) {
    return true;
  }
  if (assignmentTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewAssignmentTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newAssignmentTemplate, state.form.data));

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewAssignmentTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());
  const partInsert$ = useRef(new Subject<{ processingState: State['newPartTemplateForm']['processingState']; payload: NewPartTemplatePayload }>());
  const mediumInsert$ = useRef(new Subject<{ processingState: State['assignmentMediaForm']['processingState']; payload: NewAssignmentMediumPayload }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newAssignmentTemplateService.getAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: assignmentTemplate => {
        dispatch({ type: 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: assignmentTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newAssignmentTemplateService.saveAssignment(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
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
            dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(() => newAssignmentTemplateService.deleteAssignment(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    partInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newPartTemplateService.addPart(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: insertedPart => dispatch({ type: 'ADD_PART_TEMPLATE_SUCCEEDED', payload: insertedPart }),
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
            dispatch({ type: 'ADD_PART_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    mediumInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ payload }) => newAssignmentMediumService.addAssignmentMedium(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
        tap({
          next: progressResponse => {
            if (progressResponse.type === 'progress') {
              dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_PROGRESSED', payload: progressResponse.value });
            } else if (progressResponse.type === 'data') {
              dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: progressResponse.value });
            }
          },
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
            dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_FAILED', payload: message });
            console.log(err);
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId ]);

  const titleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const optionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const partRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`${router.asPath}/parts/${partId}`, undefined, { scroll: false });
  }, [ router ]);

  const mediumRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, mediumId: string): void => {
    void router.push(`${router.asPath}/media/${mediumId}`, undefined, { scroll: false });
  }, [ router ]);

  const partTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const partDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const partDescriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const partPartNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_PART_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumDataSourceChange = useCallback((dataSource: 'file upload' | 'url'): void => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_DATA_SOURCE_CHANGED', payload: dataSource });
  }, []);

  const assignmentMediumFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_FILE_CHANGED', payload: e.target.files?.[0] ?? null });
  }, []);

  const assignmentMediumExternalDataChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_EXTERNAL_DATA_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignmentTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Assignment Template</h1>
          <p><Link href={router.asPath + '/preview'}><a>Preview</a></Link></p>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentTemplateEditForm
                assignmentTemplate={state.newAssignmentTemplate}
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                assignmentNumberChange={assignmentNumberChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Unit</th><td>{state.newAssignmentTemplate.newUnitTemplate.title ?? state.newAssignmentTemplate.newUnitTemplate.unitLetter}</td></tr>
                    <tr><th scope="row">Parts</th><td>{state.newAssignmentTemplate.newPartTemplates.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newAssignmentTemplate.created)}</td></tr>
                    {state.newAssignmentTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newAssignmentTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Part Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewPartTemplateList parts={state.newAssignmentTemplate.newPartTemplates} partRowClick={partRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartTemplateAddForm
                formState={state.newPartTemplateForm}
                insert$={partInsert$.current}
                titleChange={partTitleChange}
                descriptionChange={partDescriptionChange}
                descriptionTypeChange={partDescriptionTypeChange}
                partNumberChange={partPartNumberChange}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Assignment Media</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewAssignmentMediumList media={state.newAssignmentTemplate.newAssignmentMedia} mediumRowClick={mediumRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentMediumAddForm
                formState={state.assignmentMediaForm}
                insert$={mediumInsert$.current}
                dataSourceChange={assignmentMediumDataSourceChange}
                captionChange={assignmentMediumCaptionChange}
                orderChange={assignmentMediumOrderChange}
                fileChange={assignmentMediumFileChange}
                externalDataChange={assignmentMediumExternalDataChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
