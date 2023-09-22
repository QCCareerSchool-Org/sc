import type { NextPage } from 'next';

import { Meta } from '@/components/Meta';
import { Section } from '@/components/Section';

const CATaxCreditsPage: NextPage = () => (
  <>
    <Meta title="Canadian Tax Credits" />
    <Section>
      <div className="container">
        <h1>Canadian Tax Credits</h1>
        <p>QC is a certified educational institution with <strong>Employment and Social Development Canada</strong>. At the end of the year, we'll be sending you a T2202 tax receipt for the course fees you paid during the year. You can use the receipt to get a tax refund.</p>
        <p className="fw-bold">You could be eligible to claim:</p>
        <ul>
          <li>The Canada Training Credit and</li>
          <li>The Tuition Tax Credit</li>
        </ul>
        <h2>Canada Training Credit</h2>
        <p>Most QC students can benefit from the Canada Training Credit. Starting in 2020, the federal government puts $250 into your training account each year you filed a tax return. You can draw on the account to get a tax refund. If you qualify, you can get as much as 50% of your course fees back.</p>
        <p>See details <a href="https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-training-credit.html" target="_blank" rel="noopener noreferrer">here</a>.</p>
        <h2>Tuition Tax Credit</h2>
        <p>Any amount of your tuition that you don't claim under the Canada Training Credit can be claimed under the Tuition Tax Credit. You can get back 15% of the amount claimed from the federal government. Your province may also provide a tax credit.</p>
        <p>Learn more <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/provincial-territorial-tax-credits-individuals.html" target="_blank" rel="noopener noreferrer">here</a>.</p>
        <h2>Getting Your T2202 Receipt</h2>
        <p>At tax time you'll be able to access your T2202 receipt in the My Account section of your online student center. We also send a copy to the CRA.</p>
        <div className="alert alert-primary">
          Please ensure that you have updated your Online Student Center account with your SIN if you have not already done so.
        </div>
      </div>
    </Section>
    <Section>
      <div className="container">
        <h2 className="h1">Sample Calculation</h2>
        <p>Tania decides to enroll in QC's Dog Grooming course. As current QC student she is entitled to a 50% discount, bringing her $2398 tuition down to $1199.</p>
        <h3 className="h5">Canada Training Credit</h3>
        <p>She can use the Canada Training Credit (CTC) to claim a refund of up to 50% of her eligible tuition fees. Half of her eligible tuition fees is $599.50. Her Canada Training Credit Limit (CTCL) for the {new Date().getFullYear()} tax year is $1500, which is greater than $599.50, so she can claim the full $599.50.</p>
        <h3 className="h5">Tuition Tax Credit</h3>
        <p>Next, Tania would like to claim the federal Tuition Tax Credit for the remaining $599.50 balance. The federal tax rate of 15% is applied, giving a refund of $89.93.</p>
        <h3 className="h5">Total Savings</h3>
        <p>Tania will get a refund of $689.43 at tax time, making the effective cost of her course only $509.57.</p>
        <div className="mb-3 py-3 px-4 bg-white d-inline-block">
          <table>
            <tbody>
              <tr><td className="text-end pe-2">$2398.00</td><th scope="row">Cost of Course</th></tr>
              <tr><td className="text-end pe-2">$1199.00</td><th scope="row">QC-Student Discount</th></tr>
              <tr><td className="text-end pe-2">&minus; $599.50</td><th scope="row">CTC</th></tr>
              <tr><td className="text-end pe-2">&minus; $89.93</td><th scope="row">Tuition Tax Credit</th></tr>
              <tr><td colSpan={2}><hr className="my-1" /></td></tr>
              <tr><td className="text-end pe-2">$509.57</td><th scope="row">Effective Cost ✔</th></tr>
            </tbody>
          </table>
        </div>
        <p>Your personal tax situation may be different. Please reach out to your personal accountant for further guidance.</p>
      </div>
    </Section>
  </>
);

export default CATaxCreditsPage;
