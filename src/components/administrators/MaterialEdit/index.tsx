import type { ChangeEventHandler, FC } from 'react';
import { useReducer } from 'react';

import { MaterialDetailsEditForm } from './MaterialDetailsEditForm';
import { MaterialImageEditForm } from './MaterialImageEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialDelete } from './useMaterialDelete';
import { useMaterialDetailsSave } from './useMaterialDetailsSave';
import { useMaterialImageAddOrReplace } from './useMaterialImageAddOrReplace';
import { useMaterialImageDelete } from './useMaterialImageDelete';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  materialId: string;
};

export const MaterialEdit: FC<Props> = ({ administratorId, materialId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, materialId);
  const detailsSave$ = useMaterialDetailsSave(dispatch);
  const delete$ = useMaterialDelete(dispatch);
  const imageAddOrReplace$ = useMaterialImageAddOrReplace(dispatch);
  const imageDelete$ = useMaterialImageDelete(dispatch);

  if (!state.material) {
    return null;
  }

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  };

  const handleOrderChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  };

  const handleMinutesChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'MINUTES_CHANGED', payload: e.target.value });
  };

  const handleChaptersChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'CHAPTERS_CHANGED', payload: e.target.value });
  };

  const handleVideosChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'VIDEOS_CHANGED', payload: e.target.value });
  };

  const handleKnowledgeChecksChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'KNOWLEDGE_CHECKS_CHANGED', payload: e.target.value });
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'MATERIAL_IMAGE_CHANGED', payload: e.target.files?.[0] ?? null });
  };

  return (
    <Section>
      <div className="container">
        <h1>Edit Material</h1>
        <div className="row">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
            <MaterialDetailsEditForm
              administratorId={administratorId}
              material={state.material}
              formState={state.detailsForm}
              save$={detailsSave$}
              delete$={delete$}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onOrderChange={handleOrderChange}
              onMinutesChange={handleMinutesChange}
              onChaptersChange={handleChaptersChange}
              onVideosChange={handleVideosChange}
              onKnowledgeChecksChange={handleKnowledgeChecksChange}
            />
            <div className="mt-4">
              <MaterialImageEditForm
                administratorId={administratorId}
                material={state.material}
                formState={state.imageForm}
                addOrReplace$={imageAddOrReplace$}
                delete$={imageDelete$}
                onImageChange={handleImageChange}
                imageVersion={state.imageVersion}
              />
            </div>
            {state.material.type === 'lesson' && (
              <div className="mt-4">
                <h2>Lesson Content</h2>
                <button className="btn btn-primary">Replace</button>
              </div>
            )}
          </div>
          <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
            <table className="table table-bordered w-auto ms-lg-auto bg-white">
              <tbody>
                <tr><th scope="row">Course</th><td>{state.material.unit.course.name}</td></tr>
                <tr><th scope="row">Unit</th><td>{state.material.unit.unitLetter}</td></tr>
                <tr><th scope="row">Type</th><td>{state.material.type}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
};
