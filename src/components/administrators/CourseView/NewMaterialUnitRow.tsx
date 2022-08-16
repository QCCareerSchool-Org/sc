import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';

import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type Props = {
  materialUnit: NewMaterialUnit;
};

export const NewMaterialUnitRow: FC<Props> = ({ materialUnit }) => {
  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLTableRowElement> = e => {
    e.preventDefault();
    void router.push(`/administrators/new-material-units/${materialUnit.materialUnitId}`);
  };

  return (
    <tr onClick={handleClick}>
      <td className="text-center">{materialUnit.unitLetter}</td>
      <td>{materialUnit.title === null ? '(none)' : materialUnit.title}</td>
      <td className="text-center">{materialUnit.order}</td>
    </tr>
  );
};
