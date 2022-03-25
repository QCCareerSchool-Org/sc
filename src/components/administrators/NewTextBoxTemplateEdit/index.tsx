import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewTextBoxEditForm } from './NewTextBoxEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { Section } from '@/components/Section';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import type { NewTextBoxTemplatePayload } from '@/services/administrators/newTextBoxTemplateService';
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
  const { newTextBoxTemplateService } = useAdminServices();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newTextBoxTemplate, state.form.data));

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
            return void navigateToLogin(router);
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
                return void navigateToLogin(router);
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
                return void navigateToLogin(router);
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
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, newTextBoxTemplateService ]);

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

  if (!state.newTextBoxTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Text Box Template</h1>
          <div className="row">
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
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Part Template</th><td>{state.newTextBoxTemplate.newPartTemplate.title ?? state.newTextBoxTemplate.newPartTemplate.partNumber}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newTextBoxTemplate.created)}</td></tr>
                    {state.newTextBoxTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newTextBoxTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
