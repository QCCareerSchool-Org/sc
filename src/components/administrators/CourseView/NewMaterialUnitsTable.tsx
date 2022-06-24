import type { ReactElement } from 'react';

import { NewMaterialUnitRow } from './NewMaterialUnitRow';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type Props = {
  newMaterialUnits: NewMaterialUnit[];
};

export const NewMaterialUnitsTable = ({ newMaterialUnits }: Props): ReactElement => (
  <table className="table table-bordered table-hover w-auto">
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
