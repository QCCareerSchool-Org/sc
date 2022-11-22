import type { FC } from 'react';
import { memo } from 'react';

import { formatDate } from '../../../formatDate';
import type { NewSubmission } from '@/domain/newSubmission';
import { useServices } from '@/hooks/useServices';

type Props = {
  newSubmission: NewSubmission;
};

export const NewSubmissionInfoTable: FC<Props> = memo(({ newSubmission }) => {
  const { gradeService } = useServices();

  return (
    <table className="table table-bordered bg-white w-auto">
      <tbody>
        <tr><th scope="row">Started</th><td>{formatDate(newSubmission.created)}</td></tr>
        {newSubmission.submitted
          ? newSubmission.skipped
            ? <tr><th scope="row">Skipped</th><td>{formatDate(newSubmission.submitted)}</td></tr>
            : (
              <>
                <tr><th scope="row">Submitted</th><td>{formatDate(newSubmission.submitted)}</td></tr>
                <tr><th scope="row">Marked</th><td>{newSubmission.closed ? formatDate(newSubmission.closed) : '---'}</td></tr>
                {newSubmission.closed && newSubmission.mark !== null && <tr><th scope="row">Grade</th><td>{gradeService.calculate(newSubmission.mark, newSubmission.points, newSubmission.created)}</td></tr>}
              </>
            )
          : <tr><th scope="row">Submitted</th><td>---</td></tr>
        }
      </tbody>
    </table>
  );
});

NewSubmissionInfoTable.displayName = 'NewSubmissionInfoTable';
