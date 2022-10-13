import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { formatDate } from '../../../formatDate';
import type { NewSubmission } from '@/domain/newSubmission';

type Props = {
  newSubmissions: NewSubmission[];
  onNewUnitClick: (e: MouseEvent<HTMLTableRowElement>, submissionId: string) => void;
};

export const SubmissionsTable: FC<Props> = memo(props => {
  const { newSubmissions } = props;
  return (
    <>
      {newSubmissions.length === 0
        ? <p>No submissions.</p>
        : (
          <table className="table table-bordered table-hover bg-white">
            <thead>
              <tr>
                <th className="text-center">Unit</th>
                <th>Status</th>
                <th className="text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {newSubmissions.map(s => (
                <tr key={s.submissionId} onClick={e => props.onNewUnitClick(e, s.submissionId)}>
                  <td className="text-center">{s.unitLetter}</td>
                  {s.closed
                    ? <td>Marked {formatDate(s.closed)}</td>
                    : s.submitted
                      ? <td>{s.skipped ? 'Skipped' : 'Submitted'} {formatDate(s.submitted)}</td>
                      : <td>In Progress</td>
                  }
                  <td className="text-center">---</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </>
  );
});

SubmissionsTable.displayName = 'SubmissionsTable';
