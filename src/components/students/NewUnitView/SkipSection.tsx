import { MouseEventHandler, ReactElement } from 'react';
import { Subject } from 'rxjs';

import type { State } from './state';

type Props = {
  submitState: State['submit'];
  skipState: State['submit'];
  errorMessage?: State['submitErrorMessage'];
  skip$: Subject<void>;
};

export const SkipSection = ({ submitState, skipState, errorMessage, skip$ }: Props): ReactElement => {

  const skipUnit: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    skip$.next();
  };

  const buttonDisabled = submitState === 'processing' || skipState === 'processing';

  return (
    <section className="skipSection">
      <div className="container">
        <h2>Skip Unit</h2>
        <p>This unit is optional. You can skip it and move on to the next unit.</p>
        <p>By skipping this unit, your tutor will not review it and you will not receive a mark.</p>
        <button onClick={skipUnit} className="btn btn-secondary" disabled={buttonDisabled}>Skip Unit</button>
      </div>
    </section>
  );
};
