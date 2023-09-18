import type { FC, MouseEventHandler } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { SubmissionSkipEvent } from './useSubmissionSkip';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
  processingState: State['processingState'];
  skip$: Subject<SubmissionSkipEvent>;
  errorMessage?: string;
};

export const SkipSection: FC<Props> = ({ studentId, courseId, submissionId, processingState, skip$, errorMessage }) => {

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    const message = 'Are you sure you want to skip these assignments? Your tutor will not review your work and you will not receive a grade.\n\nThis is irreverible.';
    if (confirm(message)) {
      skip$.next({
        studentId,
        courseId,
        submissionId,
        processingState,
      });
    }
  };

  const buttonDisabled = processingState === 'submitting' || processingState === 'skipping';

  return (
    <Section className="skipSection">
      <div className="container">
        <h2>Skip Assignments</h2>
        <p>These assignments are optional. You can skip them.</p>
        <p>By skipping these assignments, your tutor will not review them and you will not receive a mark.</p>
        <div className="d-flex align-items-center">
          <button onClick={handleButtonClick} className="btn btn-secondary" disabled={buttonDisabled}>Skip Assignments</button>
          {processingState === 'skipping' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'skip error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </Section>
  );
};
