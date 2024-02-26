import Big from 'big.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { Fragment, useMemo, useReducer } from 'react';

import { CASocialInsuranceNumberForm } from './caSocialInsuranceNumberForm';
import { MZKitNotice } from './MZKitNotice';
import { OutstandingBalance } from './OutstandingBalance';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';
import type { CRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMTransaction } from '@/domain/student/crm/crmTransaction';
import { statusName } from 'src/statusName';

type Props = {
  studentId: number;
  crmId?: number;
};

export const AccountView: FC<Props> = ({ studentId, crmId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const router = useRouter();

  useInitialData(dispatch, studentId, crmId);

  const filteredReceipts = useMemo(() => state.t2202Receipts?.filter(t => t.startYear <= 2022), [ state.t2202Receipts ]);

  const unshippedDeluxeKitWithoutBrushes = useMemo(() => {
    return state.crmStudent?.enrollments.some(e => e.bonusItemShipments.some(s => s.bonusItemId === '1f5fce32-f58a-11ed-b7ac-0050568e14ec' && !s.shipped));
  }, [ state.crmStudent?.enrollments ]);

  const hasOutstandingBalance = useMemo(() => {
    return state.crmStudent?.enrollments.some(e => {
      const amountPaid = e.transactions.filter(t => !t.extraCharge).map(t => t.amount).reduce((prev, cur) => prev.plus(cur), Big(0));
      const twoInstallmentsWorth = Big(e.installment).times(2);
      return Big(e.cost).minus(e.discount).minus(amountPaid).gte(twoInstallmentsWorth);
    });
  }, [ state.crmStudent?.enrollments ]);

  const filteredEnrollments = useMemo(() => (state.student ? state.student.enrollments.filter(e => !e.paymentsDisabled) : []), [ state.student ]);

  if (state.error) {
    return (
      <Section>
        <div className="container">
          <h1>Communications Error</h1>
          <p className="lead">There was an error reaching the back office. Please try again later.</p>
        </div>
      </Section>
    );
  }

  if (!state.student || !state.t2202Receipts) {
    return null;
  }

  const handleCourseClick = (e: MouseEvent<HTMLTableRowElement>, enrollmentId: number): void => {
    void router.push(`/students/account/enrollments/${enrollmentId}`);
  };

  const handleT2202ReceiptClick = (e: MouseEvent<HTMLTableRowElement>, t2202ReceiptId: number, year: number): void => {
    switch (year) {
      case 2015:
      case 2016:
        window.location.href = `/students/tax-receipts/view-2015.php?id=${encodeURIComponent(t2202ReceiptId)}`;
        break;
      case 2017:
        window.location.href = `/students/tax-receipts/view-2017.php?id=${encodeURIComponent(t2202ReceiptId)}`;
        break;
      case 2018:
        window.location.href = `/students/tax-receipts/view-2018.php?id=${encodeURIComponent(t2202ReceiptId)}`;
        break;
      default:
        window.location.href = `/students/tax-receipts/view.php?id=${encodeURIComponent(t2202ReceiptId)}`;
    }
  };

  return (
    <>
      {state.student.country.code === 'CA' && !state.student.hasCASocialInsuranceNumber && (
        <Section className="bg-dark text-white">
          <div className="container">
            <h2>Social Insurance Number</h2>
            <p className="lead">Starting with the 2019 tax year, you are <strong><strong>required by the Canada Revenue Agency</strong></strong> to provide QC with your Canadian social insurance number (SIN) so that we can issue your T2202 form for tax purposes. Our records indicate that we do not have a SIN associated with your account. Please enter your SIN below.</p>
            <CASocialInsuranceNumberForm />
          </div>
        </Section>
      )}
      {state.crmStudent
        ? ( // new account info
          <>
            <Section>
              <div className="container">
                <h1>My Account</h1>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <table className="table table-bordered bg-white w-auto">
                      <tbody>
                        <tr>
                          <th scope="col">Name</th>
                          <td>{state.crmStudent.firstName} {state.crmStudent.lastName}</td>
                          <td style={{ verticalAlign: 'bottom' }} />
                        </tr>
                        <tr>
                          <th scope="col">Portrait</th>
                          <td />
                          <td><a href="/students/portraits/index.bs.php">Change</a></td>
                        </tr>
                        <tr>
                          <th scope="row">Address</th>
                          <td>
                            {state.crmStudent.address1}<br />
                            {state.crmStudent.address2 && <>{state.crmStudent.address2}<br /></>}
                            {state.crmStudent.city}{state.crmStudent.province && <>&nbsp;{state.crmStudent.province.code}</>}{state.crmStudent.postalCode && <>&nbsp;&nbsp;{state.crmStudent.postalCode}</>}<br />
                            {state.crmStudent.country.name}
                          </td>
                          <td style={{ verticalAlign: 'bottom' }}><Link href="/students/account/billing-address"><a>Change</a></Link></td>
                        </tr>
                        <tr>
                          <th scope="col">Email Address</th>
                          <td>{state.crmStudent.emailAddress}</td>
                          <td style={{ verticalAlign: 'bottom' }}><Link href="/students/account/email-address"><a>Change</a></Link></td>
                        </tr>
                        <tr>
                          <th scope="col">Telephone Number</th>
                          <td>{state.crmStudent.telephoneNumber}</td>
                          <td style={{ verticalAlign: 'bottom' }}><Link href="/students/account/telephone-number"><a>Change</a></Link></td>
                        </tr>
                        <tr>
                          <th scope="col">Password</th>
                          <td>**********</td>
                          <td style={{ verticalAlign: 'bottom' }}><a href="/students/passwords/edit.php">Change</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {unshippedDeluxeKitWithoutBrushes
                    ? (
                      <div className="col-12 col-lg-6">
                        <MZKitNotice countryCode={state.crmStudent.country.code} />
                      </div>
                    )
                    : hasOutstandingBalance && (
                      <div className="col-12 col-lg-6">
                        <OutstandingBalance countryCode={state.crmStudent.country.code} />
                      </div>
                    )}
                </div>
              </div>
            </Section>
            {filteredEnrollments.length > 0 && (
              <>
                <Section>
                  <div className="container">
                    <h2>Update Your Payment Method</h2>
                    <p>If your card has expired or you would like to use a new card, you can <Link href="/students/account/card"><a>update your payment method</a></Link> before making additional payments.</p>
                  </div>
                </Section>
                <Section>
                  <div className="container">
                    <h2>Payment Information</h2>
                    <p>Select a course below to review your payment history or to make payments.</p>
                    <table className="table table-bordered table-hover bg-white">
                      <thead>
                        <tr>
                          <th>Course Name</th>
                          <th>Student Number</th>
                          <th>Status</th>
                          <th className="text-end">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.crmStudent.enrollments.filter(e => filteredEnrollments.some(f => f.course.code === e.course.code)).map(e => (
                          <tr key={e.enrollmentId} onClick={ev => handleCourseClick(ev, e.enrollmentId)} style={{ cursor: 'pointer' }}>
                            <td>{e.course.name}</td>
                            <td>{e.course.prefix}&thinsp;{e.enrollmentId}</td>
                            <td>{statusName(e.status)}</td>
                            <td className="text-end">{e.currency.symbol}{getBalance(e).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              </>
            )}
          </>
        )
        : ( // old account info
          <Section>
            <div className="container">
              <h1>My Account</h1>
              <ul>
                <li><a href="/students/passwords/edit.php">Change Password</a></li>
                <li><a href="/students/portraits/index.bs.php">Change Portrait</a></li>
              </ul>

              {filteredEnrollments.length > 0 && filteredEnrollments.map(e => (
                <Fragment key={e.enrollmentId}>
                  <h2>{e.course.name}</h2>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered w-auto">
                      <tbody>
                        {e.courseCost > 0 && <tr><td><b>Cost of Course:</b></td><td className="text-end">{e.courseCost.toFixed(2)}</td><td>{e.currencyCode}</td></tr>}
                        <tr><td><b>Remaining Balance:</b></td><td className="text-end">{Big(e.courseCost).minus(e.amountPaid).toFixed(2)}</td><td>{e.currencyCode}</td></tr>
                        {e.monthlyInstallment !== null && e.courseCost > e.amountPaid && (
                          <>
                            <tr><td><b>Monthly Installment:</b></td><td className="text-end">{e.monthlyInstallment.toFixed(2)}</td><td>{e.currencyCode}</td></tr>
                            <tr><td><b>Installments Remaining:</b></td><td>{Math.ceil(Big(e.courseCost).minus(e.amountPaid).div(e.monthlyInstallment).toNumber())}</td><td /></tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Fragment>
              ))}
            </div>
          </Section>
        )
      }
      {!!state.enrollmentsWithForms?.length && (
        <Section>
          <div className="container">
            <h2>Proof of Enrollment Forms</h2>
            <p>The following forms are available:</p>
            <ul>
              {state.enrollmentsWithForms.map(e => (
                <li key={e.enrollmentId}><a href={`/students/proof-of-enrollment/view.php?id=${encodeURIComponent(e.enrollmentId)}`}>{e.course.name}</a></li>
              ))}
            </ul>
          </div>
        </Section>
      )}
      {filteredReceipts && filteredReceipts.length > 0 && (
        <Section>
          <div className="container">
            <h2>Tax Receipts</h2>
            <p>Please retain a copy of these tax receipts for your records.</p>
            <table className="table table-bordered table-hover w-auto bg-white">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map(t => (
                  <tr key={t.t2202ReceiptId} onClick={e => handleT2202ReceiptClick(e, t.t2202ReceiptId, t.startYear)} style={{ cursor: 'pointer' }}>
                    <td>{t.startYear}</td>
                    <td>{t.enrollment.course.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </>
  );
};

const getBalance = (e: CRMEnrollment & { transactions: CRMTransaction[] }): number => {
  const cost = Big(e.cost).minus(e.discount);
  const amountPaid = e.transactions.filter(t => !t.extraCharge).reduce((prev, curr) => prev.plus(curr.amount), Big(0));
  return cost.minus(amountPaid).toNumber();
};
