import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ChangeEventHandler, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewTextBoxEditForm } from './NewTextBoxEditForm';
import { initialState, reducer, State } from './state';
import { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewTextBoxTemplatePayload, newTextBoxTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  textBoxId: string;
};

const changesPreset = (textBoxTemplate: NewTextBoxTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!textBoxTemplate) {
    return false;
  }
  if (textBoxTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (textBoxTemplate.points !== parseInt(formData.points, 10)) {
    return true;
  }
  if (textBoxTemplate.lines !== (formData.lines === '' ? null : parseInt(formData.lines, 10))) {
    return true;
  }
  if (textBoxTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  if (textBoxTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewTextBoxTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.textBoxTemplate, state.form.data));

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewTextBoxTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newTextBoxTemplateService.getTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: textBoxTemplate => {
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newTextBoxTemplateService.saveTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, payload).pipe(
        tap({
          next: updatedTextBox => {
            dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: updatedTextBox });
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
            dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(() => newTextBoxTemplateService.deleteTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId ]);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const pointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'POINTS_CHANGED', payload: e.target.value });
  }, []);

  const linesChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'LINES_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  const optionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.textBoxTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Text Box Template</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewTextBoxEditForm
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                descriptionChange={descriptionChange}
                pointsChange={pointsChange}
                linesChange={linesChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-4 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Part</th><td>{state.textBoxTemplate.part.title ?? state.textBoxTemplate.part.partNumber}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.textBoxTemplate.created)}</td></tr>
                  {state.textBoxTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.textBoxTemplate.modified)}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
