import type { FC, ReactEventHandler } from 'react';
import { memo, useRef } from 'react';

import { Audio } from '@/components/Audio';
import type { NewSubmission } from '@/domain/student/newSubmission';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  courseId: number;
  newSubmission: NewSubmission;
  progressStepSize?: number;
  onProgress: (progress: number) => void;
};

export const NewSubmissionStatus: FC<Props> = memo(({ studentId, courseId, newSubmission, progressStepSize = 5, onProgress }) => {
  const progress = useRef(0);

  if (Math.floor(100 / progressStepSize) !== 100 / progressStepSize) {
    throw Error('Invalid step value--must be a factor of 100');
  }

  const handleTimeUpdate: ReactEventHandler<HTMLAudioElement> = e => {
    const target = e.target as HTMLAudioElement;
    const newProgress = Math.floor(100 * target.currentTime / target.duration / progressStepSize) * progressStepSize;

    if (newProgress > progress.current) {
      progress.current = newProgress;
      onProgress(newProgress);
    }
  };

  if (newSubmission.closed) {
    const responseSrc = `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${newSubmission.submissionId}/response`;
    return (
      <div className="alert alert-success">
        <h5>Assignments Marked</h5>
        <p className="fw-bold">Your assignments have been marked. Please listen to your tutor's audio feedback below.</p>
        <Audio onTimeUpdate={handleTimeUpdate} src={responseSrc} type={newSubmission.responseMimeTypeId ?? undefined} controls preload="auto" />
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
