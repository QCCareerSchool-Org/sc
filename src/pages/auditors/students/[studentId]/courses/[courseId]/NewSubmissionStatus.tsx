import type { FC } from 'react';
import type { NewSubmission } from '@/domain/auditor/newSubmission';
import { formatDate } from 'src/formatDate';

type Props = {
  newSubmission: NewSubmission;
};

export const NewSubmissionStatus: FC<Props> = ({ newSubmission }) => {
  if (newSubmission.closed) {
    return <>Marked {formatDate(newSubmission.closed)}</>;
  }
  if (newSubmission.submitted) {
    return <>{newSubmission.skipped ? 'Skipped' : 'Submitted'} {formatDate(newSubmission.submitted)}</>;
  }

  return <>Started {formatDate(newSubmission.created)}</>;
};
