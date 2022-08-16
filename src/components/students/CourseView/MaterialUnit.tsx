import type { FC } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import { Material } from './Material';
import type { NewMaterial } from '@/domain/newMaterial';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';
import { useUnitToggleDispatch } from '@/hooks/useUnitToggleDispatch';
import { useUnitToggleState } from '@/hooks/useUnitToggleState';

type Props = {
  courseId: number;
  unit: NewMaterialUnit & {
    newMaterials: NewMaterial[];
  };
};

const iconSize = 24;

export const MaterialUnit: FC<Props> = ({ courseId, unit }) => {
  const unitToggleState = useUnitToggleState();
  const unitToggleDispatch = useUnitToggleDispatch();

  const handleClick = (): void => {
    unitToggleDispatch({ type: 'TOGGLE', payload: { courseId, unitLetter: unit.unitLetter } });
  };

  const open = !!unitToggleState?.[courseId]?.[unit.unitLetter];

  return (
    <>
      <div onClick={handleClick} className="d-flex justify-content-between" style={{ cursor: 'pointer' }}>
        <h3 className="h5 mb-0">Unit {unit.unitLetter}</h3>
        {open ? <AiOutlineMinusCircle size={iconSize} /> : <AiOutlinePlusCircle size={iconSize} />}
      </div>
      <Separator />
      {open && unit.newMaterials.map(m => <Material key={m.materialId} material={m} />)}
    </>
  );
};

const Separator: FC = () => (
  <>
    <hr className="unitSeparator" />
    <style jsx>{`
      .unitSeparator {
        opacity: 1;
        border-top:0;
        border-left:0;
        border-bottom: 2px solid #c70c27;
        border-right:0;
      }
    `}</style>
  </>
);
