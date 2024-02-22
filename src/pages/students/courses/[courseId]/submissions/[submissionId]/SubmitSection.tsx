import type { FC, MouseEventHandler } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { SubmissionSubmitEvent } from './useSubmissionSubmit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
  processingState: State['processingState'];
  expired: boolean;
  submit$: Subject<SubmissionSubmitEvent>;
  unitComplete: boolean;
  optionalAssignmentsIncomplete: boolean;
  errorMessage?: string;
};

export const SubmitSection: FC<Props> = props => {
  const { studentId, courseId, submissionId, processingState, submit$, unitComplete, optionalAssignmentsIncomplete, errorMessage } = props;
  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (!optionalAssignmentsIncomplete || confirm('Are you sure you want to submit your unit without completing your optional assignments?')) {
      submit$.next({
        studentId,
        courseId,
        submissionId,
        processingState,
      });
    }
  };

  const buttonDisabled = props.expired || !unitComplete || processingState === 'submitting' || processingState === 'skipping';

  return (
    <Section className="submitSection">
      <div className="container">
        <h2>Submit Assignments</h2>
        {unitComplete && (
          <>
            <p>Your assignments are complete. Please click the &ldquo;Submit Assignments&rdquo; button below to send it to your tutor for marking. Once you have submitted your assignments, you will not be able to make any further changes to them.</p>
            {optionalAssignmentsIncomplete && <p><strong>Note:</strong> Some optional assignments are not yet complete. You can submit your assignments now, but your tutor will not mark the incomplete assignments.</p>}
          </>
        )}
        {!unitComplete && (
          <p>Your assignments are <u>not yet complete</u>. Please complete all assignments before submitting.</p>
        )}
        <div className="d-flex align-items-center">
          <button onClick={handleButtonClick} className="btn btn-primary" disabled={buttonDisabled}>Submit Assignments</button>
          {processingState === 'submitting' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'submit error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </Section>
  );
};
