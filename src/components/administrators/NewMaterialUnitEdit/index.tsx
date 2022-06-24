import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewMaterialEditForm } from './NewMaterialEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialInsert } from './useMaterialInsert';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  materialUnitId: string;
};

export const NewMaterialUnitEdit = ({ administratorId, materialUnitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, materialUnitId, dispatch);

  const materialInsert$ = useMaterialInsert(dispatch);

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

  const handleMaterialFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    const files = e.target.files;
    if (files?.length) {
      dispatch({ type: 'MATERIAL_FILE_CHANGED', payload: files[0] });
    } else {
      dispatch({ type: 'MATERIAL_FILE_CHANGED', payload: null });
    }
  }, []);

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
          lsdkfjdljk
        </div>
      </Section>
    </>
  );
};
