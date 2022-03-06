import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEvent, ReactElement, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewPartEditForm } from './NewPartEditForm';
import { NewTextBoxAddForm } from './NewTextBoxAddForm';
import { NewUploadSlotAddForm } from './NewUploadSlotAddForm';
import { initialState, reducer, State } from './state';
import { TextBoxList } from './TextBoxList';
import { UploadSlotList } from './UploadSlotList';
import { NewPartTemplate } from '@/domain/newPartTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewPartTemplatePayload, newPartTemplateService, NewTextBoxTemplatePayload, newTextBoxTemplateService, NewUploadSlotTemplatePayload, newUploadSlotTemplateService } from '@/services/administrators';
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

  const save$ = useRef(new Subject<{ processingState: State['form']['processingState']; payload: NewPartTemplatePayload }>());
  const delete$ = useRef(new Subject<State['form']['processingState']>());
  const textBoxInsert$ = useRef(new Subject<{ processingState: State['textBoxForm']['processingState']; payload: NewTextBoxTemplatePayload }>());
  const uploadSlotInsert$ = useRef(new Subject<{ processingState: State['uploadSlotForm']['processingState']; payload: NewUploadSlotTemplatePayload }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newPartTemplateService.getPart(administratorId, schoolId, courseId, unitId, assignmentId, partId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: partTemplate => {
        dispatch({ type: 'LOAD_PART_TEMPLATE_SUCCEEDED', payload: partTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_PART_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newPartTemplateService.savePart(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
        tap({
          next: updatedPart => {
            dispatch({ type: 'SAVE_PART_TEMPLATE_SUCCEEDED', payload: updatedPart });
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
            dispatch({ type: 'SAVE_PART_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    delete$.current.pipe(
      filter(processingState => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_PART_TEMPLATE_STARTED' })),
      exhaustMap(() => newPartTemplateService.deletePart(administratorId, schoolId, courseId, unitId, assignmentId, partId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_PART_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_PART_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    textBoxInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newTextBoxTemplateService.addTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
        tap({
          next: insertedTextBox => {
            dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: insertedTextBox });
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
            dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    uploadSlotInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newUploadSlotTemplateService.addUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
        tap({
          next: insertedTextBox => {
            dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: insertedTextBox });
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
            dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId ]);

  const titleChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TITLE_CHANGED', payload: target.value });
  }, []);

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: target.value });
  }, []);

  const partNumberChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'PART_NUMBER_CHANGED', payload: target.value });
  }, []);

  const optionalChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_CHANGED', payload: target.checked });
  }, []);

  const textBoxRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, textBoxId: string): void => {
    void router.push(`${router.asPath}/textBoxes/${textBoxId}/edit`);
  }, [ router ]);

  const uploadSlotRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, uploadSlotId: string): void => {
    void router.push(`${router.asPath}/uploadSlots/${uploadSlotId}/edit`);
  }, [ router ]);

  const textBoxDescriptionChange: FormEventHandler<HTMLTextAreaElement> = useCallback(e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'TEXT_BOX_TEMPLATE_DESCRIPTION_CHANGED', payload: target.value });
  }, []);

  const textBoxPointsChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_TEMPLATE_POINTS_CHANGED', payload: target.value });
  }, []);

  const textBoxLinesChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_TEMPLATE_LINES_CHANGED', payload: target.value });
  }, []);

  const textBoxOrderChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_TEMPLATE_ORDER_CHANGED', payload: target.value });
  }, []);

  const textBoxOptionalChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED', payload: target.checked });
  }, []);

  const uploadSlotLabelChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED', payload: target.value });
  }, []);

  const uploadSlotPointsChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED', payload: target.value });
  }, []);

  const uploadSlotOrderChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED', payload: target.value });
  }, []);

  const uploadSlotImageChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED', payload: target.checked });
  }, []);

  const uploadSlotPdfChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED', payload: target.checked });
  }, []);

  const uploadSlotWordChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED', payload: target.checked });
  }, []);

  const uploadSlotExcelChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED', payload: target.checked });
  }, []);

  const uploadSlotOptionalChange: FormEventHandler<HTMLInputElement> = useCallback(e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED', payload: target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.partTemplate) {
    return null;
  }

  const partDescriptionWarning = !state.partTemplate.description && (state.partTemplate.uploadSlots.length > 0 || state.partTemplate.textBoxes.filter(t => !t.description).length > 0);
  const textBoxDescriptionWarning = state.partTemplate.textBoxes.filter(t => !t.description).length > 1;

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Part</h1>
          <div className="row justify-content-between">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewPartEditForm
                partTemplate={state.partTemplate}
                formState={state.form}
                save$={save$.current}
                delete$={delete$.current}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                partNumberChange={partNumberChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
              <table className="table table-bordered w-auto ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Assignment</th><td>{state.partTemplate.assignment.title ?? state.partTemplate.assignment.assignmentNumber}</td></tr>
                  <tr><th scope="row">Text Boxes</th><td>{state.partTemplate.textBoxes.length}</td></tr>
                  <tr><th scope="row">Upload Slots</th><td>{state.partTemplate.uploadSlots.length}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.partTemplate.created)}</td></tr>
                  {state.partTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.partTemplate.modified)}</td></tr>}
                </tbody>
              </table>
              {(partDescriptionWarning || textBoxDescriptionWarning) && (
                <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                  {partDescriptionWarning && (
                    <div className="alert alert-warning">
                      <h6>Part Description Warning</h6>
                      <p className="mb-0">A part can only omit a description if all its text boxes have descriptions and it has no upload slots.</p>
                    </div>
                  )}
                  {textBoxDescriptionWarning && (
                    <div className="alert alert-warning">
                      <h6>Text Box Description Warning</h6>
                      <p className="mb-0">A text box can only omit a description when it is the only text box for the part and the part has a description.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Text Boxes</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <TextBoxList textBoxes={state.partTemplate.textBoxes} textBoxRowClick={textBoxRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewTextBoxAddForm
                formState={state.textBoxForm}
                insert$={textBoxInsert$.current}
                descriptionChange={textBoxDescriptionChange}
                pointsChange={textBoxPointsChange}
                linesChange={textBoxLinesChange}
                orderChange={textBoxOrderChange}
                optionalChange={textBoxOptionalChange}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Upload Slots</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <UploadSlotList uploadSlots={state.partTemplate.uploadSlots} uploadSlotRowClick={uploadSlotRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewUploadSlotAddForm
                formState={state.uploadSlotForm}
                insert$={uploadSlotInsert$.current}
                labelChange={uploadSlotLabelChange}
                pointsChange={uploadSlotPointsChange}
                orderChange={uploadSlotOrderChange}
                imageChange={uploadSlotImageChange}
                pdfChange={uploadSlotPdfChange}
                wordChange={uploadSlotWordChange}
                excelChange={uploadSlotExcelChange}
                optionalChange={uploadSlotOptionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
