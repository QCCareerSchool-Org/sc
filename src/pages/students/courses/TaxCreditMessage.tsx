import Link from 'next/link';
import type { FC } from 'react';

export const TaxCreditMessage: FC = () => (
  <div className="alert alert-primary mb-4">
    <p>Canadian students can be eligible for tax credits. <strong>Enroll before the new year</strong> and get back over 50% of your tution.</p>
    <p className="mb-0">Some conditions apply. <Link href="/tax-credits/ca"><a className="alert-link">Learn more</a></Link></p>
  </div>
);
