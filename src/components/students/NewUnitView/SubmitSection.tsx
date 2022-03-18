import type { MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  submit$: Subject<State['processingState']>;
  unitComplete: boolean;
  optionalAssignmentsIncomplete: boolean;
  processingState: State['processingState'];
  errorMessage?: string;
};

export const SubmitSection = ({ submit$, unitComplete, optionalAssignmentsIncomplete, processingState, errorMessage }: Props): ReactElement | null => {
  const submitUnit: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (!optionalAssignmentsIncomplete || confirm('Are you sure you want to submit your unit without completing your optional assignments?')) {
      submit$.next(processingState);
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
          <button onClick={submitUnit} className="btn btn-primary" disabled={buttonDisabled}>Submit Unit</button>
          {processingState === 'submitting' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'submit error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </Section>
  );
};
