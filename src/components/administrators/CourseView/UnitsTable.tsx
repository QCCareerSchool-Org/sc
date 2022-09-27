import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';

import type { Unit } from '@/domain/unit';

type Props = {
  units: Unit[];
};

export const UnitsTable: FC<Props> = ({ units }) => {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    e.preventDefault();
    void router.push(`/administrators/units/${unitId}`);
  };

  return (
    <table className="table table-bordered table-hover w-auto bg-white">
      <thead>
        <tr>
          <th className="text-center">Unit</th>
          <th>Title</th>
          <th className="text-center">Order</th>
        </tr>
      </thead>
      <tbody>
        {units.map(u => (
          <tr key={u.unitId} onClick={e => handleClick(e, u.unitId)}>
            <td className="text-center">{u.unitLetter}</td>
            <td>{u.title === null ? '(none)' : u.title}</td>
            <td className="text-center">{u.order}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
