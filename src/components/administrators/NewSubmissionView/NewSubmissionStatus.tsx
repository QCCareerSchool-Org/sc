import type { FC } from 'react';
import type { NewSubmission } from '@/domain/administrator/newSubmission';

type Props = {
  submission: NewSubmission;
};

export const NewSubmissionStatus: FC<Props> = ({ submission }) => {
  if (!submission.submitted) {
    return <div className="alert alert-info">This submission is currently in progress.</div>;
  }

  if (submission.skipped) {
    return <div className="alert alert-info">This submission was skipped.</div>;
  }

  if (submission.tutorComment && !submission.adminComment) {
    return <div className="alert alert-danger">This submission has been returned by the tutor as is awaiting an administrator.</div>;
  }

  if (!submission.closed) {
    return <div className="alert alert-warning">This submission is waiting to be marked.</div>;
  }

  return <div className="alert alert-info">This submission is marked.</div>;
};
