import type { ReactElement } from 'react';

import { Material } from './Material';
import type { NewMaterial } from '@/domain/newMaterial';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type Props = {
  unit: NewMaterialUnit & {
    newMaterials: NewMaterial[];
  };
};

export const MaterialUnit = ({ unit }: Props): ReactElement => {
  return (
    <>
      <h3>Unit {unit.unitLetter}</h3>
      {unit.newMaterials.map(m => <Material key={m.materialId} material={m} />)}
    </>
  );
};
