import { Big } from 'big.js';
import type { ChangeEventHandler, FC } from 'react';
import { useId, useMemo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { PaymentMethodInsertEvent } from './usePaymentMethodInsert';
import { PaysafeForm } from '@/components/PaysafeForm';
import type { CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';

type Props = {
  crmId: number;
  form: State['form'];
  crmStudent: CRMStudentWithCountryProvinceAndEnrollments;
  currencyCode: string;
  currencyName: string;
  allSameCurrency: boolean;
  insert$: Subject<PaymentMethodInsertEvent>;
  onEnrollmentIdChange: ChangeEventHandler<HTMLSelectElement>;
  onUpdateAllChange: ChangeEventHandler<HTMLInputElement>;
  onCardDataChange: () => void;
};

export const NewCardForm: FC<Props> = props => {
  const { crmId, form, crmStudent, currencyCode, currencyName, allSameCurrency, insert$ } = props;

  const id = useId();

  const handleTokenize = (company: string, singleUseToken: string): void => {
    const enrollmentIds = form.data.updateAll
      ? crmStudent.enrollments.map(e => e.enrollmentId)
      : [ parseInt(form.data.enrollmentId, 10) ];
    insert$.next({
      studentId: crmId,
      enrollmentIds,
      company,
      singleUseToken,
      processingState: form.processingState,
    });
  };

  const enrollmentCount = crmStudent.enrollments.length;

  const options = useMemo(() => {
    return crmStudent.enrollments.map(e => {
      const amountPaid = e.transactions.reduce((prev, cur) => prev.plus(cur.extraCharge ? 0 : cur.amount), Big(0));
      const remainingBalance = Big(e.cost).minus(e.discount).minus(amountPaid).toFixed(2);
      return {
        enrollmentId: e.enrollmentId,
        courseName: e.course.name,
        remainingBalance: `${e.currency.symbol}${remainingBalance}`,
      };
    });
  }, [ crmStudent.enrollments ]);

  return (
    <form>
      {crmStudent.enrollments.length && (
        <div className="mb-4">
          <label htmlFor={id + '_newCardEnrollmentId'}>Course to Update</label>
          <select onChange={props.onEnrollmentIdChange} value={form.data.enrollmentId} id={id + '_newCardEnrollmentId'} className="form-select" disabled={form.data.updateAll} aria-describedby={id + '_newCardEnrollmentIdHelp'}>
            {options.map(o => {
              return <option key={o.enrollmentId} value={o.enrollmentId}>Balance: {o.remainingBalance} - {o.courseName}</option>;
            })}
          </select>
          <div id={id + '_newCardEnrollmentIdHelp'} className="form-text">Charged in {currencyName}</div>
        </div>
      )}
      {enrollmentCount > 1 && (
        <>
          {allSameCurrency
            ? (
              <div className="mb-4">
                <div className="form-check">
                  <input onChange={props.onUpdateAllChange} checked={form.data.updateAll} className="form-check-input" type="checkbox" id={id + '_newCardUpdateAll'} />
                  <label className="form-check-label" htmlFor={id + '_newCardUpdateAll'}>Update {enrollmentCount === 2 ? 'Both' : `All ${enrollmentCount}`} of My Courses</label>
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
        firstName={crmStudent.firstName}
        lastName={crmStudent.lastName}
        address1={crmStudent.address1}
        address2={crmStudent.address2}
        city={crmStudent.city}
        provinceCode={crmStudent.province?.code ?? null}
        postalCode={crmStudent.postalCode}
        countryCode={crmStudent.country.code}
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
