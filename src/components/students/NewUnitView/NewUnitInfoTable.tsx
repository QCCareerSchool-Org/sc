import type { ReactElement } from 'react';
import { memo } from 'react';

import type { NewUnit } from '@/domain/newUnit';
import { formatDate } from 'src/formatDate';

type Props = {
  newUnit: NewUnit;
};

export const NewUnitInfoTable = memo(({ newUnit }: Props): ReactElement => {
  const grade = 'A+';

  return (
    <table className="table table-bordered bg-white w-auto">
      <tbody>
        <tr><th scope="row">Started</th><td>{formatDate(newUnit.created)}</td></tr>
        {newUnit.submitted
          ? newUnit.skipped
            ? <tr><th scope="row">Skipped</th><td>{formatDate(newUnit.submitted)}</td></tr>
            : (
              <>
                <tr><th scope="row">Submitted</th><td>{formatDate(newUnit.submitted)}</td></tr>
                <tr><th scope="row">Marked</th><td>{newUnit.closed ? formatDate(newUnit.closed) : '---'}</td></tr>
                {newUnit.closed && <tr><th scope="row">Grade</th><td>{grade}</td></tr>}
              </>
            )
          : <tr><th scope="row">Submitted</th><td>---</td></tr>
        }
      </tbody>
    </table>
  );
});

NewUnitInfoTable.displayName = 'NewUnitInfoTable';
