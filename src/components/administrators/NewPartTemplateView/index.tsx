import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { NewTextBoxForm } from './NewTextBoxForm';
import { NewUploadSlotForm } from './NewUploadSlotForm';
import { initialState, reducer } from './state';
import { TextBoxList } from './TextBoxList';
import { UploadSlotList } from './UploadSlotList';
import { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import { newPartTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { formatDateTime } from 'src/formatDate';
import { navigateToLogin } from 'src/navigateToLogin';

type NewTextBoxSubmitPayload = {
  description: string | null;
  points: number;
  lines: number | null;
  order: number;
  optional: boolean;
};

type NewUploadSlotSubmitPayload = {
  label: string;
  points: number;
  allowedTypes: {
    image: boolean;
    pdf: boolean;
    word: boolean;
    excel: boolean;
  };
  order: number;
  optional: boolean;
};

export type NewTextBoxSubmitFunction = (payload: NewTextBoxSubmitPayload) => Promise<void>;

export type NewUploadSlotSubmitFunction = (payload: NewUploadSlotSubmitPayload) => Promise<void>;

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

  const textBoxSubmit: NewTextBoxSubmitFunction = async payload => {
    const fakeTexBoxPayload: NewTextBoxTemplate = {
      textBoxId: Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32),
      partId,
      description: payload.description,
      lines: payload.lines,
      points: payload.points,
      optional: payload.optional,
      order: payload.order,
      created: new Date(),
      modified: null,
    };
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    if (Math.random() > 0.825) {
      throw Error('Oh no!');
    }
    dispatch({ type: 'ADD_TEXT_BOX_SUCCEEDED', payload: fakeTexBoxPayload });
  };

  const uploadSlotSubmit: NewUploadSlotSubmitFunction = async payload => {
    const allowedTypes: string[] = [];
    if (payload.allowedTypes.image) {
      allowedTypes.push('image');
    }
    if (payload.allowedTypes.pdf) {
      allowedTypes.push('pdf');
    }
    if (payload.allowedTypes.word) {
      allowedTypes.push('word');
    }
    if (payload.allowedTypes.excel) {
      allowedTypes.push('excel');
    }
    const fakeUploadSlotPayload: NewUploadSlotTemplate = {
      uploadSlotId: Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32) + Math.random().toString(32),
      partId,
      label: payload.label,
      allowedTypes,
      points: payload.points,
      optional: payload.optional,
      order: payload.order,
      created: new Date(),
      modified: null,
    };
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    if (Math.random() > 0.825) {
      throw Error('Oh no!');
    }
    dispatch({ type: 'ADD_UPLOAD_SLOT_SUCCEEDED', payload: fakeUploadSlotPayload });
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
              <Link href={`${router.asPath}/edit`}><a className="btn btn-primary">Edit Assignment</a></Link>
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
              <NewTextBoxForm nextOrder={state.nextTextBoxOrder} submit={textBoxSubmit} />
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
              <NewUploadSlotForm nextOrder={state.nextUploadSlotOrder} submit={uploadSlotSubmit} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
