import Link from 'next/link';
import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { usePaymentMethodCharge } from './usePaymentMethodCharge';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { capitalizeFirstLetter } from 'src/capitalizeFirstLetter';
import { formatDate } from 'src/formatDate';
import { statusName } from 'src/statusName';

type Props = {
  crmId: number;
  crmEnrollmentId: number;
};

export const CourseAccountDetailsView = ({ crmId, crmEnrollmentId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, crmId, crmEnrollmentId);

  const paymentMethodCharge$ = usePaymentMethodCharge(dispatch);

  if (!state.crmEnrollment) {
    return null;
  }

  const currencyCode = state.crmEnrollment.currency.code;

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (state.form.data.paymentMethodId === null) {
      return;
    }
    paymentMethodCharge$.next({
      studentId: crmId,
      enrollmentId: crmEnrollmentId,
      paymentMethodId: state.form.data.paymentMethodId,
      amount: state.form.data.amount,
      processingState: state.form.processingState,
    });
  };

  const handlePaymentMethodChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'PAYMENT_METHOD_ID_CHANGED', payload: parseInt(e.target.value, 10) });
  };

  const handleAmountChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'AMOUNT_CHANGED', payload: parseFloat(e.target.value) });
  };

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();

  return (
    <>
      <Section>
        <div className="container">
          <h1>Course Account Details</h1>
          <p className="lead">{state.crmEnrollment.course.name}</p>
          <table className="table table-bordered w-auto bg-white">
            <tbody>
              <tr><th scope="row">Student Number</th><td>{state.crmEnrollment.course.prefix}&thinsp;{state.crmEnrollment.enrollmentId}</td></tr>
              {state.crmEnrollment.enrollmentDate !== null && <tr><th scope="row">Enrollment Date</th><td>{formatDate(state.crmEnrollment.enrollmentDate)}</td></tr>}
              {state.crmEnrollment.shippedDate !== null && <tr><th scope="row">Materials Shipped</th><td>{formatDate(state.crmEnrollment.shippedDate)}</td></tr>}
              {state.crmEnrollment.status !== null && (
                <>
                  <tr><th scope="row">Status</th><td>{statusName(state.crmEnrollment.status)}</td></tr>
                  {state.crmEnrollment.statusDate && <tr><th scope="row">Status Changed</th><td>{formatDate(state.crmEnrollment.statusDate)}</td></tr>}
                </>
              )}
              {state.crmEnrollment.installment > 0 && (
                <>
                  {state.crmEnrollment.meta.nextInstallment && <tr><th scope="row">Next Installment</th><td>{formatDate(state.crmEnrollment.meta.nextInstallment)}</td></tr>}
                  <tr><th scope="row">{capitalizeFirstLetter(state.crmEnrollment.paymentFrequency)} Installment</th><td className="text-end">{state.crmEnrollment.installment.toFixed(2)} {currencyCode}</td></tr>
                </>
              )}
              <tr><th scope="row">Cost of Course</th><td className="text-end">{state.crmEnrollment.meta.discountedCost.toFixed(2)} {currencyCode}</td></tr>
              <tr><th scope="row">Remaining Balance</th><td className="text-end">{state.crmEnrollment.meta.balance.toFixed(2)} {currencyCode}</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2>Transactions</h2>
          {state.crmEnrollment.transactions.length === 0
            ? <p>No transactions on file.</p>
            : (
              <table className="table table-bordered w-auto bg-white">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Card Number</th>
                    <th className="text-center">Exp.</th>
                  </tr>
                </thead>
                <tbody>
                  {state.crmEnrollment.transactions.map(t => (
                    <tr key={t.transactionId}>
                      <td>{formatDate(t.transactionDateTime)}</td>
                      <td className="text-end">{t.amount.toFixed(2)} {currencyCode}</td>
                      <td className="text-center">{t.paymentMethod?.pan}</td>
                      <td className="text-center">{t.paymentMethod?.expiryMonth?.toString().padStart(2, '0')} / {t.paymentMethod?.expiryYear?.toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2>Make a Payment</h2>
          {state.crmEnrollment.paymentMethods.length === 0
            ? <p>No payment methods on file. Please <Link href="/students/account/card"><a>add a payment method</a></Link> first.</p>
            : (
              <>
                <p>If you have missed a payment and would like to pay it now, you can do so below. You can also pay your balance off earlier by making advanced payments. To process a payment, simply indicate which card you would like to use, enter the amount, and click the &ldquo;Pay Now&rdquo; button.</p>
                <div className="alert alert-info">
                  <strong>Please note:</strong> making a payment here will not alter your regular payment schedule.{' '}
                  {state.crmEnrollment.meta.nextInstallment && <>Your next scheduled payment will be on {formatDate(state.crmEnrollment.meta.nextInstallment)}. </>}
                  If you would like to make changes to your scheduled payments, please contact the School.
                </div>
                <form onSubmit={handleSubmit}>
                  <table className="table table-bordered w-auto bg-white">
                    <thead>
                      <tr>
                        <th />
                        <th className="text-center">Card Number</th>
                        <th className="text-center">Exp</th>
                        <th className="text-center">Primary</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.crmEnrollment.paymentMethods.map(p => {
                        const expired = p.expiryYear === null || p.expiryMonth === null || p.expiryYear < thisYear || (p.expiryYear === thisYear && p.expiryMonth <= thisMonth);
                        const disabled = expired || p.disabled;
                        return (
                          <tr key={p.paymentMethodId}>
                            <td className={`text-center${disabled ? ' text-muted' : ''}`}>
                              <div className="ps-2">
                                <div className="form-check m-0">
                                  <input onChange={handlePaymentMethodChange} checked={p.paymentMethodId === state.form.data.paymentMethodId} className="form-check-input" type="radio" value={p.paymentMethodId.toString()} disabled={disabled} />
                                </div>
                              </div>
                            </td>
                            <td className={`text-center${disabled ? ' text-muted' : ''}`}>{p.pan}</td>
                            <td className={`text-center${disabled ? ' text-muted' : ''}`}>{p.expiryMonth?.toString().padStart(2, '0')} / {p.expiryYear}</td>
                            <td className={`text-center${disabled ? ' text-muted' : ''}`}>{p.primary ? 'yes' : 'no'}</td>
                            <td className={`text-center${disabled ? ' text-muted' : ''}`}>{expired ? 'expired' : p.disabled ? 'disabled' : ''}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="d-flex align-items-center mb-4">
                    <label htmlFor="inputEmail3" className="form-label me-2 mb-0">Amount:</label>
                    <input onChange={handleAmountChange} value={state.form.data.amount} type="number" min={0} max={2000} step={0.01} id="inputEmail3" className="form-control text-end me-2" style={{ maxWidth: 100 }} />
                    <span>{currencyCode}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-primary flex-shrink-0" style={{ width: 100 }}>
                      {state.form.processingState === 'processing' ? <Spinner size="sm" /> : 'Pay Now'}
                    </button>
                    {state.form.processingState === 'error' && <span className="text-danger ms-2">{state.form.errorMessage ? state.form.errorMessage : 'Error'}</span>}
                  </div>
                  {state.form.processingState === 'success' && (
                    <div className="alert alert-success mt-4">
                      Transaction successful
                    </div>
                  )}
                  {state.form.processingState === 'declined' && (
                    <div className="alert alert-danger mt-4">
                      Transaction declined
                    </div>
                  )}
                </form>
              </>
            )
          }
        </div>
      </Section>
    </>
  );
};
