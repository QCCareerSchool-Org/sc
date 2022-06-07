import type { ReactElement } from 'react';

import { NewMaterialRow } from './NewMaterialRow';
import type { NewMaterial } from '@/domain/newMaterial';

type Props = {
  newMaterials: NewMaterial[];
};

export const NewMaterialsTable = ({ newMaterials }: Props): ReactElement => (
  <table className="table table-bordered table-hover w-auto">
    <thead>
      <tr>
        <th className="text-center">Unit</th>
        <th>Type</th>
        <th>Title</th>
        <th className="text-center">Order</th>
      </tr>
    </thead>
    <tbody>
      {newMaterials.map(m => <NewMaterialRow key={m.materialId} material={m} />)}
    </tbody>
  </table>
);
