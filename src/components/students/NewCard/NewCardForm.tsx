import type { ChangeEventHandler, ReactElement } from 'react';
import { useRef } from 'react';
import type { Subject } from 'rxjs';

import { PaysafeForm } from './PaysafeForm';
import type { State } from './state';
import type { PaymentMethodInsertEvent } from './usePaymentMethodInsert';

type Props = {
  crmId: number;
  form: State['form'];
  onEnrollmentIdChange: ChangeEventHandler<HTMLSelectElement>;
  onUpdateAllChange: ChangeEventHandler<HTMLInputElement>;
  insert$: Subject<PaymentMethodInsertEvent>;
};

export const NewCardForm = (props: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2));
  const { crmId, form, insert$ } = props;

  const handleTokenize = (paymentToken: string): void => {
    insert$.next({
      studentId: crmId,
      enrollmentId: parseInt(form.data.enrollmentId, 10),
      updateAll: form.data.updateAll,
      paymentToken,
      processingState: form.processingState,
    });
  };

  return (
    <form>
      {form.courses.length && (
        <div className="mb-4">
          <label htmlFor={id.current + '_newCardEnrollmentId'}>Course</label>
          <select onChange={props.onEnrollmentIdChange} value={form.data.enrollmentId} id={id.current + '_newCardEnrollmentId'} className="form-control" disabled={form.data.updateAll}>
            {form.courses.map(c => (<option key={c.enrollmentId} value={c.enrollmentId}>{c.courseName}</option>))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor={id.current + '_newCardUpdateAll'}>Update All Courses</label>
        <input onChange={props.onUpdateAllChange} checked={form.data.updateAll} type="checkbox" id={id.current + '_newCardUpdateAll'} />
      </div>
      <PaysafeForm currencyCode={form.currencyCode} onTokenize={handleTokenize} />
    </form>
  );
};
