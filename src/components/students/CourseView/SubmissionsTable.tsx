import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { formatDate } from '../../../formatDate';
import type { NewSubmission } from '@/domain/newSubmission';
import { useServices } from '@/hooks/useServices';

type Props = {
  newSubmissions: NewSubmission[];
  onNewUnitClick: (e: MouseEvent<HTMLTableRowElement>, submissionId: string) => void;
};

export const SubmissionsTable: FC<Props> = memo(props => {
  const { newSubmissions } = props;
  const { gradeService } = useServices();

  return (
    <>
      {newSubmissions.length === 0
        ? <p>No submissions found.</p>
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
              {newSubmissions.map(s => {
                const grade = s.mark === null ? null : gradeService.calculate(s.mark, s.points, s.created);
                return (
                  <tr key={s.submissionId} onClick={e => props.onNewUnitClick(e, s.submissionId)}>
                    <td className="text-center">{s.unitLetter}</td>
                    {s.closed
                      ? <td>Marked {formatDate(s.closed)}</td>
                      : s.submitted
                        ? <td>{s.skipped ? 'Skipped' : 'Submitted'} {formatDate(s.submitted)}</td>
                        : <td>In Progress</td>
                    }
                    {s.closed && grade !== null
                      ? <td className="text-center">{grade.length === 1 ? <>{grade}&nbsp;&nbsp;</> : grade}</td>
                      : <td className="text-center">---</td>
                    }
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      }
    </>
  );
});

SubmissionsTable.displayName = 'SubmissionsTable';
