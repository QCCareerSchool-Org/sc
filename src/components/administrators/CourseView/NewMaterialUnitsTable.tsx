import type { FC } from 'react';

import { NewMaterialUnitRow } from './NewMaterialUnitRow';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type Props = {
  newMaterialUnits: NewMaterialUnit[];
};

export const NewMaterialUnitsTable: FC<Props> = ({ newMaterialUnits }) => (
  <table className="table table-bordered table-hover w-auto bg-white">
    <thead>
      <tr>
        <th className="text-center">Unit</th>
        <th>Title</th>
        <th className="text-center">Order</th>
      </tr>
    </thead>
    <tbody>
      {newMaterialUnits.map(u => <NewMaterialUnitRow key={u.materialUnitId} materialUnit={u} />)}
    </tbody>
  </table>
);
