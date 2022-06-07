import { useRouter } from 'next/router';
import type { MouseEventHandler, ReactElement } from 'react';

import type { NewMaterial } from '@/domain/newMaterial';

type Props = {
  material: NewMaterial;
};

export const NewMaterialRow = ({ material }: Props): ReactElement => {
  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLTableRowElement> = e => {
    e.preventDefault();
    void router.push(`/administrators/new-materials/${material.materialId}`);
  };

  return (
    <tr onClick={handleClick}>
      <td className="text-center">{material.unitLetter}</td>
      <td>{material.type}</td>
      <td>{material.title}</td>
      <td className="text-center">{material.order}</td>
    </tr>
  );
};
