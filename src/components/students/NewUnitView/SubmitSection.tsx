import { MouseEventHandler, ReactElement } from 'react';
import { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewUnitWithAssignments } from '@/services/students';

type Props = {
  unit: NewUnitWithAssignments;
  submitState: State['submit'];
  skipState: State['submit'];
  errorMessage?: State['submitErrorMessage'];
  submit$: Subject<void>;
};

export const SubmitSection = ({ unit, submitState, skipState, errorMessage, submit$ }: Props): ReactElement | null => {
  const submitUnit: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    submit$.next();
  };

  const buttonDisabled = !unit.complete || submitState === 'processing' || skipState === 'processing';

  return (
    <section className="submitSection">
      <div className="container">
        <h2>Submit Unit</h2>
        {unit.complete
          ? <p>Your unit is complete. Please click the Submit button below to send it to your tutor for marking. Once you have submitted your unit, you will not be able to make any further changes to it.</p>
          : <p>Your unit is not yet complete. Please complete all assignments before submitting your unit.</p>
        }
        <div className="d-flex align-items-center">
          <button onClick={submitUnit} className="btn btn-primary me-2" disabled={buttonDisabled}>Submit Unit</button>
          {submitState === 'processing' && <Spinner />}
          {errorMessage && <span className="text-danger">Error: {errorMessage}</span>}
        </div>
      </div>
    </section>
  );
};
