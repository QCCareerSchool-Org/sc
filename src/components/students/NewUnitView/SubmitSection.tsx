import type { MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';

type Props = {
  submit$: Subject<State['processingState']>;
  unitComplete: boolean;
  processingState: State['processingState'];
  errorMessage?: string;
};

export const SubmitSection = ({ submit$, unitComplete, processingState, errorMessage }: Props): ReactElement | null => {
  const submitUnit: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    submit$.next(processingState);
  };

  const buttonDisabled = !unitComplete || processingState === 'submitting' || processingState === 'skipping';

  return (
    <section className="submitSection">
      <div className="container">
        <h2>Submit Unit</h2>
        {unitComplete
          ? <p>Your unit is complete. Please click the Submit button below to send it to your tutor for marking. Once you have submitted your unit, you will not be able to make any further changes to it.</p>
          : <p>Your unit is <u>not yet complete</u>. Please complete all assignments before submitting your unit.</p>
        }
        <div className="d-flex align-items-center">
          <button onClick={submitUnit} className="btn btn-primary" disabled={buttonDisabled}>Submit Unit</button>
          {processingState === 'submitting' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'submit error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </section>
  );
};
