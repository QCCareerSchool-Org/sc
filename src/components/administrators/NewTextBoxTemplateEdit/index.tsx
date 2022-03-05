import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEventHandler, ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewTextBoxEditForm } from './NewTextBoxEditForm';
import { initialState, reducer, State } from './state';
import { Spinner } from '@/components/Spinner';
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
        dispatch({ type: 'TEXT_BOX_TEMPLATE_LOAD_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'TEXT_BOX_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'TEXT_BOX_TEMPLATE_SAVE_STARTED' })),
      exhaustMap(({ payload }) => newTextBoxTemplateService.saveTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, payload).pipe(
        tap({
          next: updatedTextBox => {
            dispatch({ type: 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED', payload: updatedTextBox });
            router.back();
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'TEXT_BOX_TEMPLATE_SAVE_FAILED', payload: message });
          },
        }),
      )),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'TEXT_BOX_TEMPLATE_DELETE_STARTED' })),
      exhaustMap(() => newTextBoxTemplateService.deleteTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'TEXT_BOX_TEMPLATE_DELETE_SUCCEEDED' });
            router.back();
          },
          error: err => {
            let message = 'Delete failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'TEXT_BOX_TEMPLATE_DELETE_FAILED', payload: message });
          },
        }),
      )),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.textBoxTemplate) {
    return null;
  }

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_UPDATED', payload: target.value });
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'POINTS_UPDATED', payload: target.value });
  };

  const linesChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'LINES_UPDATED', payload: target.value });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'ORDER_UPDATED', payload: target.value });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.current.next(state.form.processingState);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <h1>Edit Text Box</h1>
              <table className="table table-bordered w-auto">
                <tbody>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.textBoxTemplate.created)}</td></tr>
                  {state.textBoxTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.textBoxTemplate.modified)}</td></tr>}
                </tbody>
              </table>
              <div className="d-flex align-items-center">
                <button onClick={deleteClick} className="btn btn-danger" disabled={state.form.processingState === 'saving' || state.form.processingState === 'deleting'}>Delete</button>
                {state.form.processingState === 'deleting' && <div className="ms-2"><Spinner /></div>}
                {state.form.processingState === 'delete error' && <span className="text-danger ms-2">{state.form.errorMessage?.length ? state.form.errorMessage : 'Error'}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <NewTextBoxEditForm
                formState={state.form}
                save$={save$.current}
                descriptionChange={descriptionChange}
                pointsChange={pointsChange}
                linesChange={linesChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
