import { randAlpha, randBoolean, randNumber, randParagraph, randPastDate, randText, randUuid } from '@ngneat/falso';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { NewSubmissionStatus } from './NewSubmissionStatus';
import type { NewSubmission } from '@/domain/student/newSubmission';

describe('NewSubmissionStatus Component', () => {
  let studentId: number;
  let courseId: number;
  let newSubmission: NewSubmission;

  beforeEach(() => {
    studentId = randNumber();
    courseId = randNumber();
    newSubmission = {
      submissionId: randUuid(),
      enrollmentId: randNumber(),
      tutorId: randNumber(),
      unitLetter: randAlpha(),
      title: randText(),
      description: randParagraph() + '\n\n' + randParagraph(),
      markingCriteria: null,
      optional: randBoolean(),
      order: randNumber({ min: 0, max: 127 }),
      adminComment: null,
      tutorComment: null,
      submitted: null,
      transferred: null,
      closed: null,
      skipped: false,
      responseFilename: null,
      responseFilesize: null,
      responseMimeTypeId: null,
      complete: randBoolean(),
      points: 32,
      mark: null,
      created: randPastDate(),
      modified: randPastDate(),
    };
  });

  it('should render without accessibility issues', async () => {
    const { container } = render(<NewSubmissionStatus studentId={studentId} courseId={courseId} newSubmission={newSubmission} />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
