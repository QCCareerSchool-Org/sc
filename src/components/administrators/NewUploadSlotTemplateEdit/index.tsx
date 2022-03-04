import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEventHandler, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Observable, Subject, takeUntil, tap } from 'rxjs';

import { NewUploadSlotEditForm } from './NewUploadSlotEditForm';
import { initialState, reducer, State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewUploadSlotTemplate } from '@/domain/index';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewUploadSlotPayload, newUploadSlotTemplateService } from '@/services/administrators';
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
  uploadSlotId: string;
};

const changesPreset = (uploadSlotTemplate: NewUploadSlotTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!uploadSlotTemplate) {
    return false;
  }
  if (uploadSlotTemplate.label !== (formData.label || null)) {
    return true;
  }
  if (uploadSlotTemplate.allowedTypes.includes('image') !== formData.allowedTypes.image) {
    return true;
  }
  if (uploadSlotTemplate.allowedTypes.includes('pdf') !== formData.allowedTypes.pdf) {
    return true;
  }
  if (uploadSlotTemplate.allowedTypes.includes('word') !== formData.allowedTypes.word) {
    return true;
  }
  if (uploadSlotTemplate.allowedTypes.includes('excel') !== formData.allowedTypes.excel) {
    return true;
  }
  if (uploadSlotTemplate.points !== parseInt(formData.points, 10)) {
    return true;
  }
  if (uploadSlotTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  if (uploadSlotTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewUploadSlotTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.uploadSlotTemplate, state.form.data));

  const delete$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUploadSlotTemplateService.getUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: uploadSlotTemplate => {
        dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_LOAD_SUCCEEDED', payload: uploadSlotTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    delete$.current.pipe(
      tap(() => dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_DELETE_STARTED' })),
      exhaustMap(() => newUploadSlotTemplateService.deleteUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_DELETE_SUCCEEDED' });
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
            dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_DELETE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId ]);

  const saveUploadSlot = useCallback((payload: NewUploadSlotPayload): Observable<NewUploadSlotTemplate> => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_SAVE_STARTED' });
    return newUploadSlotTemplateService.saveUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, payload).pipe(
      tap({
        next: uploadSlotTemplate => {
          dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_SAVE_SUCCEEDED', payload: uploadSlotTemplate });
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
          dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_SAVE_FAILED', payload: message });
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.uploadSlotTemplate) {
    return null;
  }

  const labelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'LABEL_UPDATED', payload: target.value });
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'POINTS_UPDATED', payload: target.value });
  };

  const imageChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'IMAGE_UPDATED', payload: target.checked });
  };

  const pdfChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PDF_UPDATED', payload: target.checked });
  };

  const wordChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'WORD_UPDATED', payload: target.checked });
  };

  const excelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'EXCEL_UPDATED', payload: target.checked });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'ORDER_UPDATED', payload: target.value });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.current.next();
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <h1>Edit Upload Slot</h1>
              <table className="table table-bordered w-auto">
                <tbody>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.uploadSlotTemplate.created)}</td></tr>
                  {state.uploadSlotTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.uploadSlotTemplate.modified)}</td></tr>}
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
              <NewUploadSlotEditForm
                formState={state.form}
                save={saveUploadSlot}
                labelChange={labelChange}
                pointsChange={pointsChange}
                imageChange={imageChange}
                pdfChange={pdfChange}
                wordChange={wordChange}
                excelChange={excelChange}
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
