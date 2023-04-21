import Big from 'big.js';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { catchError, EMPTY, map, Subject, switchMap, takeUntil } from 'rxjs';

import type { CRMCountry } from '@/domain/crm/crmCountry';
import type { CRMStudent } from '@/domain/student/crm/crmStudent';
import { useStudentServices } from '@/hooks/useStudentServices';
import type { CRMEnrollmentWithCourse } from '@/services/students/crmEnrollmentService';
import { getTelephoneNumber } from 'src/lib/helper-functions';

type Props = {
  crmId?: number;
};

type Data = CRMEnrollmentWithCourse & { crmStudent: CRMStudent & { country: CRMCountry } };

export const MZKitNotice: FC<Props> = ({ crmId }) => {
  const [ enrollment, setEnrollment ] = useState<Data>();
  const { crmStudentService, crmEnrollmentService } = useStudentServices();

  const telephoneNumber = getTelephoneNumber(enrollment?.crmStudent.country.code ?? 'US');

  useEffect(() => {
    if (typeof crmId === 'undefined') {
      setEnrollment(undefined);
      return;
    }

    const destroy$ = new Subject<void>();

    crmStudentService.getCRMStudent(crmId).pipe(
      switchMap(crmStudent => {
        const mz = crmStudent.enrollments.find(e => e.course.code === 'MZ');
        if (!mz) {
          return EMPTY;
        }
        return crmEnrollmentService.getCRMEnrollment(crmId, mz.enrollmentId).pipe(
          map(crmEnrollment => ({ ...crmEnrollment, crmStudent })),
        );
      }),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe(setEnrollment);

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ crmId, crmStudentService, crmEnrollmentService ]);

  const qualifies = useMemo(() => qualifiesToPurchaseMZKit(enrollment), [ enrollment ]);

  if (!qualifies) {
    return null;
  }

  const mailtoHref = 'mailto:account@qccareerschool.com?subject=Paying Off My Balance&body=Please send me more information on any discounts and promotions that I qualify for if I pay off my balance.';

  return (
    <section>
      <div className="container">
        <div className="alert alert-success mb-0">
          <h5>Did You Know?</h5>
          <p className="mb-0">You can pay off your balance early and save on your tuition! Plus, we'll send you a bonus gift in the mail. Please <a className="alert-link" href={mailtoHref}>send us an email</a> or give us a call at <a className="text-nowrap alert-link" href={`tel:${telephoneNumber}`}>{telephoneNumber}</a> to learn more.</p>
        </div>
      </div>
    </section>
  );
};

const qualifiesToPurchaseMZKit = (enrollment?: CRMEnrollmentWithCourse): boolean => {
  if (!enrollment) { // not enrolled in MZ
    return false;
  }

  if (enrollment.paymentPlan === 'full') { // already got the kit if they paid in full
    return false;
  }

  // student who enrolled before April 19 got the kit already
  // the following three weeks were a transitionary period where some students were still given the kit
  // don't offer the kit to anyone who enrolled before 2023-05-12T00:00 (04:00 UTC) or anyone whose enrollment date isn't set
  if (enrollment.enrollmentDate === null || enrollment.enrollmentDate < new Date(Date.UTC(2023, 4, 12, 4))) {
    return false;
  }

  if (enrollment.cost <= enrollment.discount) { // free course
    return false;
  }

  if (enrollment.status !== null && enrollment.status !== 'G') { // not in good standing
    return false;
  }

  const amountPaid = enrollment.transactions.filter(t => !t.extraCharge).reduce((prev, cur) => prev.plus(cur.amount), Big(0));
  const discountedCost = Big(enrollment.cost).minus(enrollment.discount);

  if (discountedCost.minus(amountPaid).lte(discountedCost.times(0.2))) { // less than 20% left to pay off
    return false;
  }

  return true;
};
