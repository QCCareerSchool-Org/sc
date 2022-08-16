import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { formatDate } from '../../../formatDate';
import type { NewUnit } from '@/domain/newUnit';

type Props = {
  newUnits: NewUnit[];
  onNewUnitClick: (e: MouseEvent<HTMLTableRowElement>, unitId: string) => void;
};

export const UnitsTable: FC<Props> = memo(props => {
  const { newUnits } = props;
  return (
    <>
      {newUnits.length === 0
        ? <p>No units.</p>
        : (
          <>
            <h2 className="h4 text-shadow">Assignments</h2>
            <table className="table table-bordered table-hover bg-white">
              <thead>
                <tr>
                  <th className="text-center">Unit</th>
                  <th>Status</th>
                  <th className="text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {newUnits.map(u => (
                  <tr key={u.unitId} onClick={e => props.onNewUnitClick(e, u.unitId)}>
                    <td className="text-center">{u.unitLetter}</td>
                    {u.closed
                      ? <td>Marked {formatDate(u.closed)}</td>
                      : u.submitted
                        ? <td>{u.skipped ? 'Skipped' : 'Submitted'} {formatDate(u.submitted)}</td>
                        : <td>In Progress</td>
                    }
                    <td className="text-center">---</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      }
    </>
  );
});

UnitsTable.displayName = 'UnitsTable';
