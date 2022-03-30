import NextError from 'next/error';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewTextBoxEditForm } from './NewTextBoxEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useTextBoxDelete } from './useTextBoxDelete';
import { useTextBoxSave } from './useTextBoxSave';
import { Section } from '@/components/Section';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  textBoxId: string;
};

const changesPreset = (textBoxTemplate: NewTextBoxTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!textBoxTemplate) {
    return false;
  }
  if (textBoxTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (textBoxTemplate.points !== parseInt(formData.points, 10)) {
    return true;
  }
  if (textBoxTemplate.lines !== (formData.lines === '' ? null : parseInt(formData.lines, 10))) {
    return true;
  }
  if (textBoxTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  if (textBoxTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewTextBoxTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newTextBoxTemplate, state.form.data));

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, dispatch);

  const textBoxSave$ = useTextBoxSave(dispatch);
  const textBoxDelete$ = useTextBoxDelete(dispatch);

  const descriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const pointsChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'POINTS_CHANGED', payload: e.target.value });
  }, []);

  const linesChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'LINES_CHANGED', payload: e.target.value });
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

  if (!state.newTextBoxTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Text Box Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewTextBoxEditForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                textBoxId={textBoxId}
                formState={state.form}
                save$={textBoxSave$}
                delete$={textBoxDelete$}
                descriptionChange={descriptionChange}
                pointsChange={pointsChange}
                linesChange={linesChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Part Template</th><td>{state.newTextBoxTemplate.newPartTemplate.title ?? state.newTextBoxTemplate.newPartTemplate.partNumber}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newTextBoxTemplate.created)}</td></tr>
                    {state.newTextBoxTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newTextBoxTemplate.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
