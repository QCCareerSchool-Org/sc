/**
 * @jest-environment jsdom
 */

import { randAlpha, randBoolean, randCurrencyCode, randNumber, randParagraph, randPastDate, randSentence, randUuid } from '@ngneat/falso';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Subject } from 'rxjs';

import { initialState, State } from './state';
import { View } from './View';
import { Enrollment, NewAssignment, NewUnit } from '@/domain/students';
import { NewUnitWithAssignments } from '@/services/students';

describe('UnitPage component', () => {

  let state: State;
  let submit$: Subject<void>;
  let skip$: Subject<void>;

  let adminComment: string | null;
  let submitted: Date | null;
  let skipped: Date | null;
  let transferred: Date | null;
  let marked: Date | null;
  let optional: boolean;

  beforeEach(() => {
    state = initialState;
    submit$ = new Subject<void>();
    skip$ = new Subject<void>();
  });

  it('should render', async () => {
    const { container } = render(<View state={state} submit$={submit$} skip$={skip$} />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });

  describe('with a unit that\'s still in progress', () => {

    beforeEach(() => {
      adminComment = null;
      submitted = null;
      skipped = null;
      transferred = null;
      marked = null;
    });

    describe('and the unit is optional', () => {

      beforeEach(() => {
        optional = true;
      });

      describe('and the unit is complete', () => {

        beforeEach(() => {
          state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked, optional, complete: true } };
        });

        it('should have a submit button that\'s enabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /submit unit/iu });
          expect(button).not.toBeNull();
          expect(button).not.toHaveAttribute('disabled');
        });

        it('should have a skip button that\'s enabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /skip unit/iu });
          expect(button).not.toBeNull();
          expect(button).not.toHaveAttribute('disabled');
        });

        it('should have the correct status message', () => {
          const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const text = queryByText(/Your unit is currently in progress/iu);
          expect(text).not.toBeNull();
        });
      });

      describe('and the unit is incomplete', () => {

        beforeEach(() => {
          state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked, optional, complete: false } };
        });

        it('should have a submit button that\'s disabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /submit unit/iu });
          expect(button).not.toBeNull();
          expect(button).toHaveAttribute('disabled');
        });

        it('should have a skip button that\'s enabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /skip unit/iu });
          expect(button).not.toBeNull();
          expect(button).not.toHaveAttribute('disabled');
        });

        it('should have the correct status message', () => {
          const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const text = queryByText(/Your unit is currently in progress/iu);
          expect(text).not.toBeNull();
        });
      });
    });

    describe('and the unit is non-optional', () => {

      beforeEach(() => {
        optional = false;
      });

      describe('and the unit is complete', () => {

        beforeEach(() => {
          state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked, optional, complete: true } };
        });

        it('should have a submit button that\'s enabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /submit unit/iu });
          expect(button).not.toBeNull();
          expect(button).not.toHaveAttribute('disabled');
        });

        it('should not have a skip button', () => {
          const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = queryByRole('button', { name: /skip unit/iu });
          expect(button).toBeNull();
        });

        it('should have the correct status message', () => {
          const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const text = queryByText(/Your unit is currently in progress/iu);
          expect(text).not.toBeNull();
        });
      });

      describe('and the unit is incomplete', () => {

        beforeEach(() => {
          state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked, optional, complete: false } };
        });

        it('should have a submit button that\'s disabled', () => {
          const { getByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = getByRole('button', { name: /submit unit/iu });
          expect(button).not.toBeNull();
          expect(button).toHaveAttribute('disabled');
        });

        it('should not have a skip button', () => {
          const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const button = queryByRole('button', { name: /skip unit/iu });
          expect(button).toBeNull();
        });

        it('should have the correct status message', () => {
          const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
          const text = queryByText(/Your unit is currently in progress/iu);
          expect(text).not.toBeNull();
        });
      });
    });
  });

  describe('with a unit that\'s submitted', () => {

    beforeEach(() => {
      adminComment = null;
      submitted = randPastDate();
      skipped = null;
      transferred = null;
      marked = null;
      state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked } };
    });

    it('should not have a submit button', () => {
      const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const button = queryByRole('button', { name: /submit unit/iu });
      expect(button).toBeNull();
    });

    it('should not have a skip button', () => {
      const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const button = queryByRole('button', { name: /skip unit/iu });
      expect(button).toBeNull();
    });

    it('should have the correct status message', () => {
      const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const text = queryByText(/Your unit has been submitted to your tutor/iu);
      expect(text).not.toBeNull();
    });
  });

  describe('with a unit that\'s marked', () => {

    beforeEach(() => {
      adminComment = null;
      submitted = randPastDate();
      skipped = null;
      transferred = null;
      marked = randPastDate();
      state = { ...initialState, unit: { ...generateNewUnitWithAssignments(), adminComment, submitted, skipped, transferred, marked } };
    });

    it('should not have a submit button', () => {
      const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const button = queryByRole('button', { name: /submit unit/iu });
      expect(button).toBeNull();
    });

    it('should not have a skip button', () => {
      const { queryByRole } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const button = queryByRole('button', { name: /skip unit/iu });
      expect(button).toBeNull();
    });

    it('should have the correct status message', () => {
      const { queryByText } = render(<View state={state} submit$={submit$} skip$={skip$} />);
      const text = queryByText(/Your unit is marked/iu);
      expect(text).not.toBeNull();
    });
  });
});

const generateNewUnitWithAssignments = (): NewUnitWithAssignments => {
  return {
    ...generateNewUnit(),
    enrollment: generateEnrollment(),
    assignments: Array(5).fill(undefined).map(() => generateNewAssignment()),
  };
};

const generateNewUnit = (): NewUnit => {
  return {
    unitId: randUuid(),
    enrollmentId: randNumber(),
    tutorId: null,
    unitLetter: randAlpha({ length: 1 })[0],
    title: randSentence(),
    description: randParagraph(),
    optional: randBoolean(),
    complete: randBoolean(),
    adminComment: null,
    submitted: null,
    skipped: null,
    transferred: null,
    marked: null,
    created: randPastDate(),
  };
};

const generateEnrollment = (): Enrollment => {
  return {
    enrollmentId: randNumber(),
    courseId: randNumber(),
    studentNumber: randNumber(),
    tutorId: randNumber(),
    maxAssignments: null,
    graduated: randBoolean(),
    assignmentsDisabled: randBoolean(),
    quizzesDisabled: randBoolean(),
    onHold: false,
    holdReason: null,
    currencyCode: randCurrencyCode(),
    courseCost: randNumber(),
    amountPaid: randNumber(),
    monthlyInstallment: null,
    enrollmentDate: randPastDate(),
    fastTrack: randBoolean(),
    paymentsDisabled: randBoolean(),
  };
};

const generateNewAssignment = (): NewAssignment => {
  return {
    assignmentId: randUuid(),
    unitId: randUuid(),
    assignmentNumber: randNumber(),
    title: randSentence(),
    description: randParagraph(),
    optional: randBoolean(),
    complete: randBoolean(),
    created: randPastDate(),
  };
};
