import type { FC } from 'react';
import { memo } from 'react';

import { formatDate } from '../../../formatDate';
import type { NewSubmission } from '@/domain/newSubmission';

type Props = {
  newSubmission: NewSubmission;
};

export const NewSubmissionInfoTable: FC<Props> = memo(({ newSubmission }) => {
  const grade = 'A+'; // TODO: set grade

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
                {newSubmission.closed && <tr><th scope="row">Grade</th><td>{grade}</td></tr>}
              </>
            )
          : <tr><th scope="row">Submitted</th><td>---</td></tr>
        }
      </tbody>
    </table>
  );
});

NewSubmissionInfoTable.displayName = 'NewSubmissionInfoTable';
