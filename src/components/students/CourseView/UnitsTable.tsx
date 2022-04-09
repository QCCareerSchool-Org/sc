import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewUnit } from '@/domain/newUnit';
import { formatDate } from 'src/formatDate';

type Props = {
  newUnits: NewUnit[];
  newUnitClick: (e: MouseEvent<HTMLTableRowElement>, unitId: string) => void;
};

export const UnitsTable = memo(({ newUnits, newUnitClick }: Props): ReactElement => {
  return (
    <>
      {newUnits.length === 0
        ? <p>No units.</p>
        : (
          <table className="table table-bordered table-hover w-auto bg-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {newUnits.map(u => (
                <tr key={u.unitId} onClick={e => newUnitClick(e, u.unitId)}>
                  <td>{u.unitLetter}</td>
                  {u.closed
                    ? <td>Marked {formatDate(u.closed)}</td>
                    : u.submitted
                      ? <td>{u.skipped ? 'Skipped' : 'Submitted'} {formatDate(u.submitted)}</td>
                      : <td>In Progress</td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </>
  );
});

UnitsTable.displayName = 'UnitsTable';
