import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewAssignmentTemplateAddForm } from './NewAssignmentTemplateAddForm';
import { NewAssignmentTemplateList } from './NewAssignmentTemplateList';
import { NewUnitTemplateEditForm } from './NewUnitTemplateEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useAssignmentInsert } from './useAssignmentInsert';
import { useInitialData } from './useInitialData';
import { useUnitDelete } from './useUnitDelete';
import { useUnitSave } from './useUnitSave';
import { Section } from '@/components/Section';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
};

const changesPreset = (unitTemplate: NewUnitTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!unitTemplate) {
    return false;
  }
  if (unitTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (unitTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (unitTemplate.unitLetter !== formData.unitLetter) {
    return true;
  }
  if (unitTemplate.optional !== formData.optional) {
    return true;
  }
  if (unitTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  return false;
};

export const NewUnitTemplateEdit = ({ administratorId, schoolId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newUnitTemplate, state.form.data));

  useInitialData(administratorId, schoolId, courseId, unitId, dispatch);

  const unitSave$ = useUnitSave(dispatch);
  const unitDelete$ = useUnitDelete(dispatch);
  const assignmentInsert$ = useAssignmentInsert(dispatch);

  const titleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const unitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  const optionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const assignmentRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignmentTemplates/${assignmentId}`);
  }, [ router ]);

  const assignmentTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const assignmentDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const assignmentAssignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const assignmentOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newUnitTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Unit Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUnitTemplateEditForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                unitTemplate={state.newUnitTemplate}
                formState={state.form}
                save$={unitSave$}
                delete$={unitDelete$}
                titleChange={titleChange}
                descriptionChange={descriptionChange}
                unitLetterChange={unitLetterChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Course</th><td>{state.newUnitTemplate.course.name}</td></tr>
                    <tr><th scope="row">Assignment Templates</th><td>{state.newUnitTemplate.newAssignmentTemplates.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newUnitTemplate.created)}</td></tr>
                    {state.newUnitTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newUnitTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Assignment Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewAssignmentTemplateList assignments={state.newUnitTemplate.newAssignmentTemplates} onClick={assignmentRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentTemplateAddForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                formState={state.newAssignmentTemplateForm}
                insert$={assignmentInsert$}
                titleChange={assignmentTitleChange}
                descriptionChange={assignmentDescriptionChange}
                assignmentNumberChange={assignmentAssignmentNumberChange}
                optionalChange={assignmentOptionalChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
