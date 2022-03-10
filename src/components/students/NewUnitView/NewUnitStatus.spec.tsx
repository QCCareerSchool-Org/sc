import { randAlpha, randBoolean, randNumber, randParagraph, randPastDate, randText, randUuid } from '@ngneat/falso';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { NewUnitStatus } from './NewUnitStatus';
import type { NewUnit } from '@/domain/newUnit';

describe('NewUnitStatus Component', () => {
  let newUnit: NewUnit;

  beforeEach(() => {
    newUnit = {
      unitId: randUuid(),
      enrollmentId: randNumber(),
      tutorId: randNumber(),
      unitLetter: randAlpha(),
      title: randText(),
      description: randParagraph() + '\n\n' + randParagraph(),
      optional: randBoolean(),
      order: randNumber({ min: 0, max: 127 }),
      adminComment: null,
      submitted: null,
      skipped: null,
      transferred: null,
      marked: null,
      complete: randBoolean(),
      created: randPastDate(),
      modified: randPastDate(),
    };
  });

  it('should render without accessibility issues', async () => {
    const { container } = render(<NewUnitStatus newUnit={newUnit} />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
