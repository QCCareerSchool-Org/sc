import NextError from 'next/error';
import { useRouter } from 'next/router';
import { ChangeEventHandler, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewUploadSlotTemplateEditForm } from './NewUploadSlotTemplateEditForm';
import { initialState, reducer, State } from './state';
import { NewUploadSlotTemplate } from '@/domain/index';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewUploadSlotTemplatePayload, newUploadSlotTemplateService } from '@/services/administrators';
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

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewUploadSlotTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUploadSlotTemplateService.getUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: uploadSlotTemplate => {
        dispatch({ type: 'LOAD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: uploadSlotTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UPLOAD_SLOT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newUploadSlotTemplateService.saveUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, payload).pipe(
        tap({
          next: updatedUploadSlot => {
            dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: updatedUploadSlot });
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
            dispatch({ type: 'SAVE_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(() => newUploadSlotTemplateService.deleteUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId ]);

  const labelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'LABEL_CHANGED', payload: e.target.value });
  }, []);

  const pointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'POINTS_CHANGED', payload: e.target.value });
  }, []);

  const imageChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'IMAGE_CHANGED', payload: e.target.checked });
  }, []);

  const pdfChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PDF_CHANGED', payload: e.target.checked });
  }, []);

  const wordChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'WORD_CHANGED', payload: e.target.checked });
  }, []);

  const excelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'EXCEL_CHANGED', payload: e.target.checked });
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

  if (!state.uploadSlotTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Upload Slot Template</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUploadSlotTemplateEditForm
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
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
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Part</th><td>{state.uploadSlotTemplate.part.title ?? state.uploadSlotTemplate.part.partNumber}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.uploadSlotTemplate.created)}</td></tr>
                  {state.uploadSlotTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.uploadSlotTemplate.modified)}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
