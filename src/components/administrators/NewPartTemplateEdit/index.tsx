import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEventHandler, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Observable, Subject, takeUntil, tap } from 'rxjs';

import { NewPartEditForm } from './NewPartEditForm';
import { initialState, reducer, State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewPartTemplate } from '@/domain/index';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewPartTemplatePayload, newPartTemplateService } from '@/services/administrators';
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
};

const changesPreset = (partTemplate: NewPartTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!partTemplate) {
    return false;
  }
  if (partTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (partTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (partTemplate.partNumber !== parseInt(formData.partNumber, 10)) {
    return true;
  }
  if (partTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewPartTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.partTemplate, state.form.data));

  const delete$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newPartTemplateService.getPart(administratorId, schoolId, courseId, unitId, assignmentId, partId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: textBoxTemplate => {
        dispatch({ type: 'PART_TEMPLATE_LOAD_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'PART_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    delete$.current.pipe(
      tap(() => dispatch({ type: 'PART_TEMPLATE_DELETE_STARTED' })),
      exhaustMap(() => newPartTemplateService.deletePart(administratorId, schoolId, courseId, unitId, assignmentId, partId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'PART_TEMPLATE_DELETE_SUCCEEDED' });
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
            dispatch({ type: 'PART_TEMPLATE_DELETE_FAILED', payload: message });
          },
        }),
      )),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId ]);

  const savePart = useCallback((payload: NewPartTemplatePayload): Observable<NewPartTemplate> => {
    dispatch({ type: 'PART_TEMPLATE_SAVE_STARTED' });
    return newPartTemplateService.savePart(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
      tap({
        next: textBoxTemplate => {
          dispatch({ type: 'PART_TEMPLATE_SAVE_SUCCEEDED', payload: textBoxTemplate });
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
          dispatch({ type: 'PART_TEMPLATE_SAVE_FAILED', payload: message });
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.partTemplate) {
    return null;
  }

  const titleChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TITLE_UPDATED', payload: target.value });
  };

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_UPDATED', payload: target.value });
  };

  const partNumberChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_NUMBER_UPDATED', payload: target.value });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    if (confirm('Are you sure you want to delete this part template and all its children?')) {
      delete$.current.next();
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <h1>Edit Part</h1>
              <table className="table table-bordered w-auto">
                <tbody>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.partTemplate.created)}</td></tr>
                  {state.partTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.partTemplate.modified)}</td></tr>}
                </tbody>
              </table>
              <div className="d-flex align-items-center">
                <button onClick={deleteClick} className="btn btn-danger" disabled={state.form.processingState === 'saving' || state.form.processingState === 'deleting'}>Delete</button>
                {state.form.processingState === 'deleting' && <div className="ms-2"><Spinner /></div>}
                {state.form.processingState === 'delete error' && <span className="text-danger ms-2">{state.form.saveErrorMessage ? state.form.saveErrorMessage : 'Error'}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <NewPartEditForm
                formState={state.form}
                save={savePart}
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
