import { memo, ReactElement } from 'react';

import { NewUnit } from '@/domain/newUnit';
import { formatDate } from 'src/formatDate';

type Props = {
  newUnit: NewUnit;
};

export const NewUnitInfoTable = memo(({ newUnit }: Props): ReactElement => {
  return (
    <table className="table table-bordered bg-white w-auto">
      <tbody>
        <tr><th scope="row">Started</th><td>{formatDate(newUnit.created)}</td></tr>
        {newUnit.skipped
          ? <tr><th scope="row">Skipped</th><td>{formatDate(newUnit.skipped)}</td></tr>
          : (
            <>
              <tr><th scope="row">Submitted</th><td>{newUnit.submitted ? formatDate(newUnit.submitted) : '---'}</td></tr>
              <tr><th scope="row">Marked</th><td>{newUnit.marked ? formatDate(newUnit.marked) : '---'}</td></tr>
              {newUnit.marked && <tr><th scope="row">Grade</th><td>A+</td></tr>}
            </>
          )
        }
      </tbody>
    </table>
  );
});

NewUnitInfoTable.displayName = 'NewUnitInfoTable';
