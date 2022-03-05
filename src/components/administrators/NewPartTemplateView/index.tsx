import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEvent, ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import { initialState, reducer } from './state';
import { TextBoxList } from './TextBoxList';
import { UploadSlotList } from './UploadSlotList';
import { newPartTemplateService, NewTextBoxTemplatePayload, newTextBoxTemplateService, NewUploadSlotTemplatePayload, newUploadSlotTemplateService } from '@/services/administrators';
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

export const NewPartTemplateView = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const textBoxInsert$ = useRef(new Subject<NewTextBoxTemplatePayload>());
  const uploadSlotInsert$ = useRef(new Subject<NewUploadSlotTemplatePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newPartTemplateService.getPart(administratorId, schoolId, courseId, unitId, assignmentId, partId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: partTemplate => {
        dispatch({ type: 'PART_TEMPLATE_LOAD_SUCCEEDED', payload: partTemplate });
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

    textBoxInsert$.current.pipe(
      tap(() => dispatch({ type: 'ADD_TEXT_BOX_STARTED' })),
      exhaustMap(payload => newTextBoxTemplateService.addTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
        tap({
          next: insertedTextBox => {
            dispatch({ type: 'ADD_TEXT_BOX_SUCCEEDED', payload: insertedTextBox });
          },
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_TEXT_BOX_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    uploadSlotInsert$.current.pipe(
      tap(() => dispatch({ type: 'ADD_UPLOAD_SLOT_STARTED' })),
      exhaustMap(payload => newUploadSlotTemplateService.addUploadSlot(administratorId, schoolId, courseId, unitId, assignmentId, partId, payload).pipe(
        tap({
          next: insertedTextBox => {
            dispatch({ type: 'ADD_UPLOAD_SLOT_SUCCEEDED', payload: insertedTextBox });
          },
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_UPLOAD_SLOT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.partTemplate) {
    return null;
  }

  const textBoxRowClick = (e: MouseEvent<HTMLTableRowElement>, textBoxId: string): void => {
    void router.push(`${router.asPath}/textBoxes/${textBoxId}/edit`);
  };

  const uploadSlotRowClick = (e: MouseEvent<HTMLTableRowElement>, uploadSlotId: string): void => {
    void router.push(`${router.asPath}/uploadSlots/${uploadSlotId}/edit`);
  };

  const textBoxDescriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'TEXT_BOX_DESCRIPTION_UPDATED', payload: target.value });
  };

  const textBoxPointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_POINTS_UPDATED', payload: target.value });
  };

  const textBoxLinesChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_LINES_UPDATED', payload: target.value });
  };

  const textBoxOrderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_ORDER_UPDATED', payload: target.value });
  };

  const textBoxOptionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'TEXT_BOX_OPTIONAL_UPDATED', payload: target.checked });
  };

  const uploadSlotLabelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_LABEL_UPDATED', payload: target.value });
  };

  const uploadSlotPointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_POINTS_UPDATED', payload: target.value });
  };

  const uploadSlotOrderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_ORDER_UPDATED', payload: target.value });
  };

  const uploadSlotImageChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_IMAGE_UPDATED', payload: target.checked });
  };

  const uploadSlotPdfChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_PDF_UPDATED', payload: target.checked });
  };

  const uploadSlotWordChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_WORD_UPDATED', payload: target.checked });
  };

  const uploadSlotExcelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_EXCEL_UPDATED', payload: target.checked });
  };

  const uploadSlotOptionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'UPLOAD_SLOT_OPTIONAL_UPDATED', payload: target.checked });
  };

  const partDescriptionWarning = !state.partTemplate.description && (state.partTemplate.uploadSlots.length > 0 || state.partTemplate.textBoxes.filter(t => !t.description).length > 0);
  const textBoxDescriptionWarning = state.partTemplate.textBoxes.filter(t => !t.description).length > 1;

  return (
    <>
      <section>
        <div className="container">
          <h1>Part: {state.partTemplate.title}</h1>
          {state.partTemplate.description
            ? <p className="lead">{state.partTemplate.description}</p>
            : <p>no description</p>
          }
          <div className="row">
            <div className="col-12 col-lg-6">
              <table className="table table-bordered w-auto">
                <tbody>
                  <tr><th scope="row">Part Number</th><td>{state.partTemplate.partNumber}</td></tr>
                  <tr><th scope="row">Assignment</th><td>{state.partTemplate.assignment.title}</td></tr>
                  <tr><th scope="row">Optional</th><td>{state.partTemplate.optional ? 'yes' : 'no'}</td></tr>
                  <tr><th scope="row">Created</th><td>{formatDateTime(state.partTemplate.created)}</td></tr>
                  {state.partTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.partTemplate.modified)}</td></tr>}
                </tbody>
              </table>
              <Link href={`${router.asPath}/edit`}><a className="btn btn-primary">Edit Part</a></Link>
            </div>
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
      </section>
      <section>
        <div className="container">
          <h2 className="h3">Text Boxes</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <TextBoxList textBoxes={state.partTemplate.textBoxes} textBoxRowClick={textBoxRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewTextBoxForm
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
              <NewUploadSlotForm
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
