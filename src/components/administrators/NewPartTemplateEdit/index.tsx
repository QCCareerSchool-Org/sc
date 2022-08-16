import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
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

type Props = {
  administratorId: number;
  partId: string;
};

const changesPresent = (partTemplate: NewPartTemplate | undefined, formData: State['form']['data']): boolean => {
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

export const NewPartTemplateEdit: FC<Props> = ({ administratorId, partId }) => {
  const router = useRouter();
  const { uuidService } = useServices();
  const [ state, dispatch ] = useReducer(createReducer(uuidService), initialState);

  useWarnIfUnsavedChanges(changesPresent(state.newPartTemplate, state.form.data));

  useInitialData(dispatch, administratorId, partId);

  const partSave$ = usePartSave(dispatch);
  const partDelete$ = usePartDelete(dispatch);
  const textBoxInsert$ = useTextBoxInsert(dispatch);
  const uploadSlotInsert$ = useUploadSlotInsert(dispatch);
  const mediumInsert$ = useMediumInsert(dispatch);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleDescriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const handleMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'MARKING_CRITERIA_CHANGED', payload: e.target.value });
  }, []);

  const handlePartNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const handleTextBoxRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, textBoxId: string): void => {
    void router.push(`/administrators/new-text-box-templates/${textBoxId}`);
  }, [ router ]);

  const handleUploadSlotRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, uploadSlotId: string): void => {
    void router.push(`/administrators/new-upload-slot-templates/${uploadSlotId}`);
  }, [ router ]);

  const handleMediumRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, mediumId: string): void => {
    void router.push(`/administrators/new-part-media/${mediumId}`);
  }, [ router ]);

  const handleTextBoxDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleTextBoxPointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_POINTS_CHANGED', payload: e.target.value });
  }, []);

  const handleTextBoxLinesChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_LINES_CHANGED', payload: e.target.value });
  }, []);

  const handleTextBoxOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleTextBoxOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const handleUploadSlotLabelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED', payload: e.target.value });
  }, []);

  const handleUploadSlotPointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED', payload: e.target.value });
  }, []);

  const handleUploadSlotOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleUploadSlotImageChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED', payload: e.target.checked });
  }, []);

  const handleUploadSlotPdfChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED', payload: e.target.checked });
  }, []);

  const handleUploadSlotWordChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED', payload: e.target.checked });
  }, []);

  const handleUploadSlotExcelChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED', payload: e.target.checked });
  }, []);

  const handleUploadSlotOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const handlePartMediumCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const handlePartMediumOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handlePartMediumDataSourceChange = useCallback((dataSource: 'file upload' | 'url'): void => {
    dispatch({ type: 'PART_MEDIA_DATA_SOURCE_CHANGED', payload: dataSource });
  }, []);

  const handlePartMediumFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_MEDIA_FILE_CHANGED', payload: e.target.files?.[0] ?? null });
  }, []);

  const handlePartMediumExternalDataChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
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
                partId={partId}
                partTemplate={state.newPartTemplate}
                formState={state.form}
                save$={partSave$}
                delete$={partDelete$}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onDescriptionTypeChange={handleDescriptionTypeChange}
                onMarkingCriteriaChange={handleMarkingCriteriaChange}
                onPartNumberChange={handlePartNumberChange}
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
              <NewTextBoxTemplateList textBoxes={state.newPartTemplate.newTextBoxTemplates} onClick={handleTextBoxRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewTextBoxTemplateAddForm
                administratorId={administratorId}
                partId={partId}
                formState={state.newTextBoxTemplateForm}
                insert$={textBoxInsert$}
                onDescriptionChange={handleTextBoxDescriptionChange}
                onPointsChange={handleTextBoxPointsChange}
                onLinesChange={handleTextBoxLinesChange}
                onOrderChange={handleTextBoxOrderChange}
                onOptionalChange={handleTextBoxOptionalChange}
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
              <NewUploadSlotTemplateList uploadSlots={state.newPartTemplate.newUploadSlotTemplates} onClick={handleUploadSlotRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewUploadSlotTemplateAddForm
                administratorId={administratorId}
                partId={partId}
                formState={state.newUoloadSlotTemplateForm}
                insert$={uploadSlotInsert$}
                onLabelChange={handleUploadSlotLabelChange}
                onPointsChange={handleUploadSlotPointsChange}
                onOrderChange={handleUploadSlotOrderChange}
                onImageChange={handleUploadSlotImageChange}
                onPdfChange={handleUploadSlotPdfChange}
                onWordChange={handleUploadSlotWordChange}
                onExcelChange={handleUploadSlotExcelChange}
                onOptionalChange={handleUploadSlotOptionalChange}
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
              <NewPartMediumList media={state.newPartTemplate.newPartMedia} onClick={handleMediumRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartMediumAddForm
                administratorId={administratorId}
                partId={partId}
                formState={state.partMediaForm}
                insert$={mediumInsert$}
                onDataSourceChange={handlePartMediumDataSourceChange}
                onCaptionChange={handlePartMediumCaptionChange}
                onOrderChange={handlePartMediumOrderChange}
                onFileChange={handlePartMediumFileChange}
                onExternalDataChange={handlePartMediumExternalDataChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
