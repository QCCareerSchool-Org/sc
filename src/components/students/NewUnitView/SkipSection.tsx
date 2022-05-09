import type { MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  skip$: Subject<State['processingState']>;
  processingState: State['processingState'];
  errorMessage?: string;
};

export const SkipSection = ({ skip$, processingState, errorMessage }: Props): ReactElement => {

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    const message = 'Are you sure you want to skip this unit? Your tutor will not review your work and you will no receive a grade for this unit.\n\nThis is irreverible.';
    if (confirm(message)) {
      skip$.next(processingState);
    }
  };

  const buttonDisabled = processingState === 'submitting' || processingState === 'skipping';

  return (
    <Section className="skipSection">
      <div className="container">
        <h2>Skip Unit</h2>
        <p>This unit is optional. You can skip it and move on to the next unit.</p>
        <p>By skipping this unit, your tutor will not review it and you will not receive a mark.</p>
        <div className="d-flex align-items-center">
          <button onClick={handleButtonClick} className="btn btn-secondary" disabled={buttonDisabled}>Skip Unit</button>
          {processingState === 'skipping' && <div className="ms-2"><Spinner /></div>}
          {processingState === 'skip error' && <span className="text-danger ms-2">{errorMessage ? errorMessage : 'Error'}</span>}
        </div>
      </div>
    </Section>
  );
};
