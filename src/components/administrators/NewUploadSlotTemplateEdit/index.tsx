import NextError from 'next/error';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewUploadSlotTemplateEditForm } from './NewUploadSlotTemplateEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useUploadSlotDelete } from './useUploadSlotDelete';
import { useUploadSlotSave } from './useUploadSlotSave';
import { Section } from '@/components/Section';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { formatDateTime } from 'src/formatDate';

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
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newUploadSlotTemplate, state.form.data));

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, partId, uploadSlotId, dispatch);

  const uploadSlotSave$ = useUploadSlotSave(dispatch);
  const uploadSlotDelete$ = useUploadSlotDelete(dispatch);

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

  if (!state.newUploadSlotTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Upload Slot Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUploadSlotTemplateEditForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                partId={partId}
                uploadSlotId={uploadSlotId}
                formState={state.form}
                save$={uploadSlotSave$}
                delete$={uploadSlotDelete$}
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
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Part Template</th><td>{state.newUploadSlotTemplate.newPartTemplate.title ?? state.newUploadSlotTemplate.newPartTemplate.partNumber}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newUploadSlotTemplate.created)}</td></tr>
                    {state.newUploadSlotTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newUploadSlotTemplate.modified)}</td></tr>}
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
