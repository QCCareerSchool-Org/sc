import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

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
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
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

export const NewAssignmentTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const { uuidService } = useServices();
  const [ state, dispatch ] = useReducer(createReducer(uuidService), initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newAssignmentTemplate, state.form.data));

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, dispatch);

  const assignmentSave$ = useAssignmentSave(dispatch);
  const assignmentDelete$ = useAssignmentDelete(dispatch);
  const partInsert$ = usePartInsert(dispatch);
  const mediumInsert$ = useMediumInsert(dispatch);

  const titleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const optionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const partRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, partId: string): void => {
    void router.push(`${router.asPath}/partTemplates/${partId}`);
  }, [ router ]);

  const mediumRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, mediumId: string): void => {
    void router.push(`${router.asPath}/media/${mediumId}`);
  }, [ router ]);

  const partTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const partDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const partDescriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const partPartNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'PART_TEMPLATE_PART_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentMediumDataSourceChange = useCallback((dataSource: 'file upload' | 'url'): void => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_DATA_SOURCE_CHANGED', payload: dataSource });
  }, []);

  const assignmentMediumFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_MEDIA_FILE_CHANGED', payload: e.target.files?.[0] ?? null });
  }, []);

  const assignmentMediumExternalDataChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
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
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                assignmentTemplate={state.newAssignmentTemplate}
                formState={state.form}
                save$={assignmentSave$}
                delete$={assignmentDelete$}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                assignmentNumberChange={assignmentNumberChange}
                optionalChange={optionalChange}
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
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Part Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewPartTemplateList parts={state.newAssignmentTemplate.newPartTemplates} partRowClick={partRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewPartTemplateAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                formState={state.newPartTemplateForm}
                insert$={partInsert$}
                titleChange={partTitleChange}
                descriptionChange={partDescriptionChange}
                descriptionTypeChange={partDescriptionTypeChange}
                partNumberChange={partPartNumberChange}
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
              <NewAssignmentMediumList media={state.newAssignmentTemplate.newAssignmentMedia} onClick={mediumRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentMediumAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                formState={state.assignmentMediaForm}
                insert$={mediumInsert$}
                dataSourceChange={assignmentMediumDataSourceChange}
                captionChange={assignmentMediumCaptionChange}
                orderChange={assignmentMediumOrderChange}
                fileChange={assignmentMediumFileChange}
                externalDataChange={assignmentMediumExternalDataChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
