import type { ReactElement } from 'react';
import { memo } from 'react';

import { Section } from '@/components/Section';

type Props = {
  reason: 'wrong tutor' | 'not submitted';
};

export const InaccessibleUnit = memo(({ reason }: Props): ReactElement => (
  <Section>
    <div className="container">
      <h1>Inaccessible Unit</h1>
      {reason === 'wrong tutor' && <p className="lead">This unit is not unavailable. You are neither the tutor for this student's unit or the tutor for this student's course.</p>}
      {reason === 'not submitted' && <p className="lead">This unit has not been submitted.</p>}
    </div>
  </Section>
));

InaccessibleUnit.displayName = 'InaccessibleUnit';
