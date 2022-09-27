import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { MaterialAddForm } from './MaterialAddForm';
import { MaterialTable } from './MaterialTable';
import { initialState, reducer } from './state';
import { UnitEditForm } from './UnitEditForm';
import { useInitialData } from './useInitialData';
import { useMaterialInsert } from './useMaterialInsert';
import { useUnitDelete } from './useUnitDelete';
import { useUnitSave } from './useUnitSave';
import { Section } from '@/components/Section';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  unitId: string;
};

export const UnitEdit: FC<Props> = ({ administratorId, unitId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, unitId);
  const unitSave$ = useUnitSave(dispatch);
  const unitDelete$ = useUnitDelete(dispatch);
  const materialInsert$ = useMaterialInsert(dispatch);

  const handleUnitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialTypeChange: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialContentChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const files = e.target.files;
    if (files?.length) {
      dispatch({ type: 'MATERIAL_CONTENT_CHANGED', payload: files[0] });
    } else {
      dispatch({ type: 'MATERIAL_CONTENT_CHANGED', payload: null });
    }
  }, []);

  const handleMaterialImageChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const files = e.target.files;
    if (files?.length) {
      dispatch({ type: 'MATERIAL_IMAGE_CHANGED', payload: files[0] });
    } else {
      dispatch({ type: 'MATERIAL_IMAGE_CHANGED', payload: null });
    }
  }, []);

  const handleMaterialMinutesChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_MINUTES_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialChaptersChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_CHAPTERS_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialVideosChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_VIDEOS_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialKnowledgeChecksChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_KNOWLEDGE_CHECKS_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialExternalDatChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_EXTERNAL_DATA_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialClick = useCallback((e: MouseEvent<HTMLTableRowElement>, materialId: string) => {
    void router.push(`/administrators/materials/${materialId}`);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.unit) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Unit</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <UnitEditForm
                administratorId={administratorId}
                unitId={unitId}
                formState={state.form}
                save$={unitSave$}
                delete$={unitDelete$}
                onUnitLetterChange={handleUnitLetterChange}
                onTitleChange={handleTitleChange}
                onOrderChange={handleOrderChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto bg-white">
                  <tbody>
                    <tr><th scope="row">Course</th><td>{state.unit.courseId}</td></tr>
                    <tr><th scope="row">Lessons</th><td>{state.unit.materials.filter(m => m.type === 'lesson').length}</td></tr>
                    <tr><th scope="row">Videos</th><td>{state.unit.materials.filter(m => m.type === 'video').length}</td></tr>
                    <tr><th scope="row">Downloads</th><td>{state.unit.materials.filter(m => m.type === 'download').length}</td></tr>
                    <tr><th scope="row">Assignment Reminders</th><td>{state.unit.materials.filter(m => m.type === 'assignment').length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.unit.created)}</td></tr>
                    {state.unit.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.unit.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Materials</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              {state.unit.materials.length === 0
                ? <p>No materials found.</p>
                : <MaterialTable materials={state.unit.materials} onClick={handleMaterialClick} />
              }
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <MaterialAddForm
                administratorId={administratorId}
                unitId={unitId}
                formState={state.materialForm}
                insert$={materialInsert$}
                onTypeChange={handleMaterialTypeChange}
                onTitleChange={handleMaterialTitleChange}
                onDescriptionChange={handleMaterialDescriptionChange}
                onOrderChange={handleMaterialOrderChange}
                onContentChange={handleMaterialContentChange}
                onImageChange={handleMaterialImageChange}
                onExternalDataChange={handleMaterialExternalDatChange}
                onMinutesChange={handleMaterialMinutesChange}
                onChaptersChange={handleMaterialChaptersChange}
                onVideosChange={handleMaterialVideosChange}
                onKnowledgeChecksChange={handleMaterialKnowledgeChecksChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
