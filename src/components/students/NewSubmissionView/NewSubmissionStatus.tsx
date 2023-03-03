import type { FC } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { Audio } from '@/components/Audio';
import type { NewSubmission } from '@/domain/student/newSubmission';

type Props = {
  studentId: number;
  courseId: number;
  newSubmission: NewSubmission;
};

export const NewSubmissionStatus: FC<Props> = memo(({ studentId, courseId, newSubmission }) => {
  if (newSubmission.closed) {
    const responseSrc = `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${newSubmission.submissionId}/response`;
    return (
      <div className="alert alert-success">
        <h5>Assignments Marked</h5>
        <p className="fw-bold">Your assignments have been marked. Please listen to your tutor's audio feedback below.</p>
        <Audio src={responseSrc} controls preload="auto" />
      </div>
    );
  }

  if (newSubmission.submitted) {
    if (newSubmission.skipped) {
      return (
        <div className="alert alert-info">
          <h5>Assignments Skipped</h5>
          <p className="fw-bold mb-0">These assignments has been skipped. You won't receive a grade for them.</p>
        </div>
      );
    }

    return (
      <div className="alert alert-success">
        <h5>Assignments Submitted</h5>
        <p className="fw-bold mb-0">Your assignments have been submitted to your tutor. Please check back in a few days to review your tutor's audio feeback.</p>
      </div>
    );
  }

  if (newSubmission.adminComment) {
    return (
      <>
        <div className="alert alert-danger">
          <h5>Assignments Have Been Returned</h5>
          <p>Your assignments have been returned by your tutor for changes. Please review the comments below, make the required changes, and then resubmit it.</p>
          <div className="comments">
            {newSubmission.adminComment.replace(/\r\n/gu, '\n').split('\n\n').map((line, i) => <p key={i} className="fst-italic">{line}</p>)}
          </div>
        </div>
        <style jsx>{`
          .comments > p:last-of-type { margin-bottom: 0; }
        `}</style>
      </>
    );
  }

  return (
    <div className="alert alert-info">
      <h5>Assignments in Progress</h5>
      <p className="fw-bold mb-0">Your assignments are currently in progress. Once you have completed your assignments, please submit them to your tutor using the &ldquo;Submit Assignments&rdquo; button below.</p>
    </div>
  );
});

NewSubmissionStatus.displayName = 'NewSubmissionStatus';
