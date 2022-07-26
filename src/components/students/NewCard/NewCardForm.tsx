import type { ChangeEventHandler, ReactElement } from 'react';
import { useRef } from 'react';
import type { Subject } from 'rxjs';

import { PaysafeForm } from '../../PaysafeForm';
import type { State } from './state';
import type { PaymentMethodInsertEvent } from './usePaymentMethodInsert';
import type { CRMStudentPayload } from '@/services/students/crmStudentService';

type Props = {
  crmId: number;
  form: State['form'];
  student: CRMStudentPayload;
  currencyCode: string;
  currencyName: string;
  allSameCurrency: boolean;
  insert$: Subject<PaymentMethodInsertEvent>;
  onEnrollmentIdChange: ChangeEventHandler<HTMLSelectElement>;
  onUpdateAllChange: ChangeEventHandler<HTMLInputElement>;
  onCardDataChange: () => void;
};

export const NewCardForm = (props: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2));
  const { crmId, form, student, currencyCode, currencyName, allSameCurrency, insert$ } = props;

  const handleTokenize = (singleUseToken: string): void => {
    const enrollmentIds = form.data.updateAll
      ? student.enrollments.map(e => e.enrollmentId)
      : [ parseInt(form.data.enrollmentId, 10) ];
    insert$.next({
      studentId: crmId,
      enrollmentIds,
      singleUseToken,
      processingState: form.processingState,
    });
  };

  const enrollmentCount = student.enrollments.length;

  return (
    <form>
      {student.enrollments.length && (
        <div className="mb-4">
          <label htmlFor={id.current + '_newCardEnrollmentId'}>Course to Update</label>
          <select onChange={props.onEnrollmentIdChange} value={form.data.enrollmentId} id={id.current + '_newCardEnrollmentId'} className="form-control" disabled={form.data.updateAll} aria-describedby={id.current + '_newCardEnrollmentIdHelp'}>
            {student.enrollments.map(e => (<option key={e.enrollmentId} value={e.enrollmentId}>{e.course.name} ({e.course.prefix}{e.enrollmentId})</option>))}
          </select>
          <div id={id.current + '_newCardEnrollmentIdHelp'} className="form-text">Charged in {currencyName}</div>
        </div>
      )}
      {enrollmentCount > 1 && (
        <>
          {allSameCurrency
            ? (
              <div className="mb-4">
                <div className="form-check">
                  <input onChange={props.onUpdateAllChange} checked={form.data.updateAll} className="form-check-input" type="checkbox" id={id.current + '_newCardUpdateAll'} />
                  <label className="form-check-label" htmlFor={id.current + '_newCardUpdateAll'}>Update {enrollmentCount === 2 ? 'Both' : `All ${enrollmentCount}`} of My Courses</label>
                </div>
              </div>
            )
            : (
              <div className="mb-4">
                <div className="alert alert-info">
                  You are enrolled in <strong>{enrollmentCount} courses</strong>. If you would like to update the card on file for more than one course, <strong>please fill out this form for each course</strong> that you would like to update.
                </div>
              </div>
            )}
        </>
      )}
      <PaysafeForm
        key={currencyCode}
        currencyCode={currencyCode}
        firstName={student.firstName}
        lastName={student.lastName}
        address1={student.address1}
        address2={student.address2}
        city={student.city}
        provinceCode={student.province?.code ?? null}
        postalCode={student.postalCode}
        countryCode={student.country.code}
        buttonText="Update Card"
        submitting={form.processingState === 'processing'}
        onTokenize={handleTokenize}
        onChange={props.onCardDataChange}
      />
      {props.form.processingState === 'success' && (
        <div className="alert alert-success mt-4 mb-0">
          Credit card updated!
        </div>
      )}
    </form>
  );
};
