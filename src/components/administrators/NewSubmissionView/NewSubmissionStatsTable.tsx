import type { FC } from 'react';

import { Audio } from '@/components/Audio';
import type { NewSubmission } from '@/domain/administrator/newSubmission';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  submission: NewSubmission;
};

export const NewSubmissionStatsTable: FC<Props> = ({ administratorId, submission }) => {
  const { gradeService } = useServices();
  return (
    <table className="table table-sm table-bordered bg-white submissionStats ms-lg-auto w-auto">
      <tbody>
        <tr><th scope="row">Created</th><td>{formatDateTime(submission.created)}</td></tr>
        {submission.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(submission.modified)}</td></tr>}
        {submission.submitted && <tr><th scope="row">{submission.skipped ? 'Skippped' : 'Submitted'}</th><td>{formatDateTime(submission.submitted)}</td></tr>}
        {submission.transferred && <tr><th scope="row">Transferred</th><td>{formatDateTime(submission.transferred)}</td></tr>}
        {submission.closed && <tr><th scope="row">Marked</th><td>{formatDateTime(submission.closed)}</td></tr>}
        {submission.submitted && submission.closed && !submission.skipped && (
          <>
            {submission.points > 0
              ? (
                <>
                  <tr><th scope="row">Mark</th><td>{submission.mark ?? '--'} / {submission.points}{submission.mark !== null && <>&nbsp;&nbsp;({gradeService.calculate(submission.mark, submission.points, submission.submitted)})</>}</td></tr>
                  {submission.markOverride !== null && <tr><th scope="row">Override</th><td>{submission.markOverride} / {submission.points}&nbsp;&nbsp;({gradeService.calculate(submission.markOverride, submission.points, submission.submitted)})</td></tr>}
                </>
              )
              : <tr><th scope="row">Mark</th><td>N/A</td></tr>
            }
          </>
        )}
        {submission.responseFilename !== null && <tr><th scope="row">Audio File</th><td style={{ padding: '0.3rem' }}><Audio controls src={`${endpoint}/administrators/${administratorId}/newSubmissions/${submission.submissionId}/feedback`} style={{ marginBottom: -6, maxHeight: 32, maxWidth: 240 }} /></td></tr>}
      </tbody>
    </table>
  );
};
