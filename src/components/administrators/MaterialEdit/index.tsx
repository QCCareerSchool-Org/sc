import type { FC } from 'react';
import { useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  materialId: string;
};

export const MaterialEdit: FC<Props> = ({ administratorId, materialId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, materialId);

  if (!state.newMaterial) {
    return null;
  }

  return (
    <Section>
      <div className="container">
        <h1>Edit Material</h1>
        <div className="row">
          <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
            <form>
              <div className="mb-3">
                <input type="text" />
              </div>
            </form>
          </div>
          <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1">
            <table className="table table-bordered w-auto ms-lg-auto bg-white">
              <tbody>
                <tr><th scope="row">Unit</th><td>{state.newMaterial.unitId}</td></tr>
                <tr><th scope="row">Type</th><td>{state.newMaterial.type}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
};
