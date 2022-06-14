import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
import { NewAssignmentMediumAddForm } from './NewAssignmentMediumAddForm';
import { NewAssignmentMediumList } from './NewAssignmentMediumList';
import { NewAssignmentTemplateEditForm } from './NewAssignmentTemplateEditForm';
import { NewPartTemplateAddForm } from './NewPartTemplateAddForm';
import { NewPartTemplateList } from './NewPartTemplateList';
import type { State } from './state';
import { createReducer, initialState } from './state';
import { useAssignmentDelete } from './useAssignmentDelete';
import { useAssignmentSave } from './useAssignmentSave';
import { useInitialData } from './useInitialData';
import { useMediumInsert } from './useMediumInsert';
import { usePartInsert } from './usePartInsert';
import { Section } from '@/components/Section';
import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import { useServices } from '@/hooks/useServices';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

type Props = {
  administratorId: number;
  assignmentId: string;
};

const changesPreset = (assignmentTemplate: NewAssignmentTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!assignmentTemplate) {
    return false;
  }
  if (assignmentTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (assignmentTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (assignmentTemplate.assignmentNumber !== parseInt(formData.assignmentNumber, 10)) {
    return true;
  }
  if (assignmentTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewAssignmentTemplateEdit = ({ administratorId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const { uuidService } = useServices();
  const [ state, dispatch ] = useReducer(createReducer(uuidService), initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newAssignmentTemplate, state.form.data));

  useInitialData(administratorId, assignmentId, dispatch);

  const assignmentSave$ = useAssignmentSave(dispatch);
  const assignmentDelete$ = useAssignmentDelete(dispatch);
  const partInsert$ = usePartInsert(dispatch);
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

  const handleAssignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const handleOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const handlePartRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`/administrators/new-part-templates/${partId}`);
  }, [ router ]);

  const handleMediumRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, mediumId: string): void => {
    void router.push(`/administrators/new-assignment-media/${mediumId}`);
  }, [ router ]);

  const handlePartTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handlePartDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handlePartDescriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const handlePartMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_MARKING_CRITERIA_CHANGED', payload: e.target.value });
  }, []);

  const handlePartPartNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_PART_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentMediumCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentMediumOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentMediumDataSourceChange = useCallback((dataSource: 'file upload' | 'url'): void => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_DATA_SOURCE_CHANGED', payload: dataSource });
  }, []);

  const handleAssignmentMediumFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_FILE_CHANGED', payload: e.target.files?.[0] ?? null });
  }, []);

  const handleAssignmentMediumExternalDataChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_EXTERNAL_DATA_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignmentTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Assignment Template</h1>

          <p><Link href={router.asPath + '/preview'}><a>Preview</a></Link></p>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentTemplateEditForm
                administratorId={administratorId}
                assignmentId={assignmentId}
                assignmentTemplate={state.newAssignmentTemplate}
                formState={state.form}
                save$={assignmentSave$}
                delete$={assignmentDelete$}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onDescriptionTypeChange={handleDescriptionTypeChange}
                onMarkingCriteriaChange={handleMarkingCriteriaChange}
                onAssignmentNumberChange={handleAssignmentNumberChange}
                onOptionalChange={handleOptionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Unit Template</th><td>{state.newAssignmentTemplate.newUnitTemplate.title ?? state.newAssignmentTemplate.newUnitTemplate.unitLetter}</td></tr>
                    <tr><th scope="row">Part Templates</th><td>{state.newAssignmentTemplate.newPartTemplates.length}</td></tr>
                    <tr><th scope="row">Media</th><td>{state.newAssignmentTemplate.newAssignmentMedia.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newAssignmentTemplate.created)}</td></tr>
                    {state.newAssignmentTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newAssignmentTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
              {state.form.meta.sanitizedHtml.length > 0 && (
                <div>
                  <div className="alert alert-info">
                    <h3 className="h6">HTML Preview</h3>
                    <div className="htmlPreview" dangerouslySetInnerHTML={{ __html: state.form.meta.sanitizedHtml }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Part Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewPartTemplateList parts={state.newAssignmentTemplate.newPartTemplates} onClick={handlePartRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartTemplateAddForm
                administratorId={administratorId}
                assignmentId={assignmentId}
                formState={state.newPartTemplateForm}
                insert$={partInsert$}
                onTitleChange={handlePartTitleChange}
                onDescriptionChange={handlePartDescriptionChange}
                onDescriptionTypeChange={handlePartDescriptionTypeChange}
                onMarkingCriteriaChange={handlePartMarkingCriteriaChange}
                onPartNumberChange={handlePartPartNumberChange}
              />
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Assignment Media</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewAssignmentMediumList media={state.newAssignmentTemplate.newAssignmentMedia} onClick={handleMediumRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentMediumAddForm
                administratorId={administratorId}
                assignmentId={assignmentId}
                formState={state.assignmentMediaForm}
                insert$={mediumInsert$}
                onDataSourceChange={handleAssignmentMediumDataSourceChange}
                onCaptionChange={handleAssignmentMediumCaptionChange}
                onOrderChange={handleAssignmentMediumOrderChange}
                onFileChange={handleAssignmentMediumFileChange}
                onExternalDataChange={handleAssignmentMediumExternalDataChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
