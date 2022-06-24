import type { ReactElement } from 'react';
import { useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  materialUnitId: string;
  materialId: string;
};

export const NewMaterialEdit = ({ administratorId, materialUnitId, materialId }: Props): ReactElement => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, materialUnitId, materialId, dispatch);

  return (
    <Section>
      <div className="container">
        <h1>Edit Material</h1>
        <pre>
          {JSON.stringify(state.newMaterial, undefined, '  ')}
        </pre>
      </div>
    </Section>
  );
};
