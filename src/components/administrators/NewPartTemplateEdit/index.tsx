import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewPartMediumAddForm } from './NewPartMediumAddForm';
import { NewPartMediumList } from './NewPartMediumList';
import { NewPartTemplateEditForm } from './NewPartTemplateEditForm';
import { NewTextBoxTemplateAddForm } from './NewTextBoxTemplateAddForm';
import { NewTextBoxTemplateList } from './NewTextBoxTemplateList';
import { NewUploadSlotTemplateAddForm } from './NewUploadSlotTemplateAddForm';
import { NewUploadSlotTemplateList } from './NewUploadSlotTemplateList';
import type { State } from './state';
import { createReducer, initialState } from './state';
import { useInitialData } from './useInitialData';
import { useMediumInsert } from './useMediumInsert';
import { usePartDelete } from './usePartDelete';
import { usePartSave } from './usePartSave';
import { useTextBoxInsert } from './useTextBoxInsert';
import { useUploadSlotInsert } from './useUploadSlotInsert';
import { Section } from '@/components/Section';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import { useServices } from '@/hooks/useServices';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { formatDateTime } from 'src/formatDate';

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
  return false;
};

export const NewPartTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId }: Props): ReactElement | null => {
  const router = useRouter();
  const { uuidService } = useServices();
  const [ state, dispatch ] = useReducer(createReducer(uuidService), initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newPartTemplate, state.form.data));

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, partId, dispatch);

  const partSave$ = usePartSave(dispatch);
  const partDelete$ = usePartDelete(dispatch);
  const textBoxInsert$ = useTextBoxInsert(dispatch);
  const uploadSlotInsert$ = useUploadSlotInsert(dispatch);
  const mediumInsert$ = useMediumInsert(dispatch);

  const titleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const descriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const partNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const textBoxRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, textBoxId: string): void => {
    void router.push(`${router.asPath}/textBoxTemplates/${textBoxId}`);
  }, [ router ]);

  const uploadSlotRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, uploadSlotId: string): void => {
    void router.push(`${router.asPath}/uploadSlotTemplates/${uploadSlotId}`);
  }, [ router ]);

  const mediumRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, mediumId: string): void => {
    void router.push(`${router.asPath}/media/${mediumId}`);
  }, [ router ]);

  const textBoxDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const textBoxPointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_POINTS_CHANGED', payload: e.target.value });
  }, []);

  const textBoxLinesChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_LINES_CHANGED', payload: e.target.value });
  }, []);

  const textBoxOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const textBoxOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const uploadSlotLabelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED', payload: e.target.value });
  }, []);

  const uploadSlotPointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED', payload: e.target.value });
  }, []);

  const uploadSlotOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const uploadSlotImageChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED', payload: e.target.checked });
  }, []);

  const uploadSlotPdfChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED', payload: e.target.checked });
  }, []);

  const uploadSlotWordChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED', payload: e.target.checked });
  }, []);

  const uploadSlotExcelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED', payload: e.target.checked });
  }, []);

  const uploadSlotOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const partMediumCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const partMediumOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const partMediumDataSourceChange = useCallback((dataSource: 'file upload' | 'url'): void => {
    dispatch({ type: 'PART_MEDIA_DATA_SOURCE_CHANGED', payload: dataSource });
  }, []);

  const partMediumFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_FILE_CHANGED', payload: e.target.files?.[0] ?? null });
  }, []);

  const partMediumExternalDataChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_EXTERNAL_DATA_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newPartTemplate) {
    return null;
  }

  const partDescriptionWarning = !state.newPartTemplate.description && (state.newPartTemplate.newUploadSlotTemplates.length > 0 || state.newPartTemplate.newTextBoxTemplates.filter(t => !t.description).length > 0);
  const textBoxDescriptionWarning = state.newPartTemplate.newTextBoxTemplates.length > 1 && state.newPartTemplate.newTextBoxTemplates.some(t => !t.description);

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Part Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewPartTemplateEditForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                partTemplate={state.newPartTemplate}
                formState={state.form}
                save$={partSave$}
                delete$={partDelete$}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                descriptionTypeChange={descriptionTypeChange}
                partNumberChange={partNumberChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Assignment Template</th><td>{state.newPartTemplate.newAssignmentTemplate.title ?? state.newPartTemplate.newAssignmentTemplate.assignmentNumber}</td></tr>
                    <tr><th scope="row">Text Box Templates</th><td>{state.newPartTemplate.newTextBoxTemplates.length}</td></tr>
                    <tr><th scope="row">Upload Slot Templates</th><td>{state.newPartTemplate.newUploadSlotTemplates.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newPartTemplate.created)}</td></tr>
                    {state.newPartTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newPartTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
              {(partDescriptionWarning || textBoxDescriptionWarning || state.form.meta.sanitizedHtml.length > 0) && (
                <div>
                  {state.form.meta.sanitizedHtml.length > 0 && (
                    <div className="alert alert-info">
                      <h3 className="h6">HTML Preview</h3>
                      <div className="htmlPreview" dangerouslySetInnerHTML={{ __html: state.form.meta.sanitizedHtml }} />
                    </div>
                  )}
                  {partDescriptionWarning && (
                    <div className="alert alert-warning">
                      <h3 className="h6">Part Description Warning</h3>
                      <p className="mb-0">A part should not omit a description if any of its text boxes are missing descriptions or if it has any upload slots.</p>
                    </div>
                  )}
                  {textBoxDescriptionWarning && (
                    <div className="alert alert-warning">
                      <h3 className="h6">Text Box Description Warning</h3>
                      <p className="mb-0">When there are multiple text boxes, each text box should have a description.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Text Box Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewTextBoxTemplateList textBoxes={state.newPartTemplate.newTextBoxTemplates} onClick={textBoxRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewTextBoxTemplateAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                formState={state.newTextBoxTemplateForm}
                insert$={textBoxInsert$}
                descriptionChange={textBoxDescriptionChange}
                pointsChange={textBoxPointsChange}
                linesChange={textBoxLinesChange}
                orderChange={textBoxOrderChange}
                optionalChange={textBoxOptionalChange}
              />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Upload Slot Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewUploadSlotTemplateList uploadSlots={state.newPartTemplate.newUploadSlotTemplates} onClick={uploadSlotRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewUploadSlotTemplateAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                formState={state.newUoloadSlotTemplateForm}
                insert$={uploadSlotInsert$}
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
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Part Media</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewPartMediumList media={state.newPartTemplate.newPartMedia} onClick={mediumRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartMediumAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                formState={state.partMediaForm}
                insert$={mediumInsert$}
                dataSourceChange={partMediumDataSourceChange}
                captionChange={partMediumCaptionChange}
                orderChange={partMediumOrderChange}
                fileChange={partMediumFileChange}
                externalDataChange={partMediumExternalDataChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
