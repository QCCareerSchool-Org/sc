import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { NewMaterialAddForm } from './NewMaterialAddForm';
import { NewMaterialList } from './NewMaterialList';
import { NewMaterialUnitEditForm } from './NewMaterialUnitEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialInsert } from './useMaterialInsert';
import { useMaterialUnitSave } from './useMaterialUnitSave';
import { Section } from '@/components/Section';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  materialUnitId: string;
};

export const NewMaterialUnitEdit: FC<Props> = ({ administratorId, materialUnitId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, materialUnitId);
  const materialUnitSave$ = useMaterialUnitSave(dispatch);
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

  const handleMaterialExternalDatChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'MATERIAL_EXTERNAL_DATA_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialClick = useCallback((e: MouseEvent<HTMLTableRowElement>, materialId: string) => {
    void router.push(`/administrators/new-materials/${materialId}`);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newMaterialUnit) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Material Unit</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewMaterialUnitEditForm
                administratorId={administratorId}
                materialUnitId={materialUnitId}
                formState={state.form}
                save$={materialUnitSave$}
                onUnitLetterChange={handleUnitLetterChange}
                onTitleChange={handleTitleChange}
                onOrderChange={handleOrderChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Course</th><td>{state.newMaterialUnit.courseId}</td></tr>
                    <tr><th scope="row">Lessons</th><td>{state.newMaterialUnit.newMaterials.filter(m => m.type === 'lesson').length}</td></tr>
                    <tr><th scope="row">Videos</th><td>{state.newMaterialUnit.newMaterials.filter(m => m.type === 'video').length}</td></tr>
                    <tr><th scope="row">Downloads</th><td>{state.newMaterialUnit.newMaterials.filter(m => m.type === 'download').length}</td></tr>
                    <tr><th scope="row">Assignment Reminders</th><td>{state.newMaterialUnit.newMaterials.filter(m => m.type === 'assignment').length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newMaterialUnit.created)}</td></tr>
                    {state.newMaterialUnit.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newMaterialUnit.modified)}</td></tr>}
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
              <NewMaterialList newMaterials={state.newMaterialUnit.newMaterials} onClick={handleMaterialClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewMaterialAddForm
                administratorId={administratorId}
                materialUnitId={materialUnitId}
                formState={state.newMaterialForm}
                insert$={materialInsert$}
                onTypeChange={handleMaterialTypeChange}
                onTitleChange={handleMaterialTitleChange}
                onDescriptionChange={handleMaterialDescriptionChange}
                onOrderChange={handleMaterialOrderChange}
                onContentChange={handleMaterialContentChange}
                onImageChange={handleMaterialImageChange}
                onExternalDataChange={handleMaterialExternalDatChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
