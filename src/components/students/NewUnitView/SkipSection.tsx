import type { MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';

type Props = {
  skip$: Subject<State['processingState']>;
  processingState: State['processingState'];
  errorMessage?: string;
};

export const SkipSection = ({ skip$, processingState, errorMessage }: Props): ReactElement => {

  const skipUnit: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    skip$.next(processingState);
  };

  const buttonDisabled = processingState === 'submitting' || processingState === 'skipping';

  return (
    <section className="skipSection">
      <div className="container">
        <h2>Skip Unit</h2>
        <p>This unit is optional. You can skip it and move on to the next unit.</p>
        <p>By skipping this unit, your tutor will not review it and you will not receive a mark.</p>
        <div className="d-flex align-items-center">
          <button onClick={skipUnit} className="btn btn-secondary" disabled={buttonDisabled}>Skip Unit</button>
          {processingState === 'skipping' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'skip error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </section>
  );
};
