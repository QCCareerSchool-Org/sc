import type { FC, MouseEventHandler } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { UnitSubmitEvent } from './useUnitSubmit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
  submit$: Subject<UnitSubmitEvent>;
  unitComplete: boolean;
  optionalAssignmentsIncomplete: boolean;
  errorMessage?: string;
};

export const SubmitSection: FC<Props> = props => {
  const { studentId, courseId, unitId, processingState, submit$, unitComplete, optionalAssignmentsIncomplete, errorMessage } = props;
  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (!optionalAssignmentsIncomplete || confirm('Are you sure you want to submit your unit without completing your optional assignments?')) {
      submit$.next({
        studentId,
        courseId,
        unitId,
        processingState,
      });
    }
  };

  const buttonDisabled = !unitComplete || processingState === 'submitting' || processingState === 'skipping';

  return (
    <Section className="submitSection">
      <div className="container">
        <h2>Submit Unit</h2>
        {unitComplete && (
          <>
            <p>Your unit is complete. Please click the Submit button below to send it to your tutor for marking. Once you have submitted your unit, you will not be able to make any further changes to it.</p>
            {optionalAssignmentsIncomplete && <p><strong>Note:</strong> Some optional assignments are not yet complete. You can submit your unit now, but your tutor will not mark the incomplete assignments.</p>}
          </>
        )}
        {!unitComplete && (
          <p>Your unit is <u>not yet complete</u>. Please complete all assignments before submitting your unit.</p>
        )}
        <div className="d-flex align-items-center">
          <button onClick={handleButtonClick} className="btn btn-primary" disabled={buttonDisabled}>Submit Unit</button>
          {processingState === 'submitting' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'submit error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </Section>
  );
};
