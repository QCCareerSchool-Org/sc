import Link from 'next/link';
import type { FC } from 'react';

import type { CertificationData } from './certificationData';
import { Section } from '@/components/Section';

type Props = {
  certificationData: CertificationData;
  graduated: boolean;
  graduatedDate: Date | null;
  amountPaidRate: number;
};

export const CertificationLogoSection: FC<Props> = ({ certificationData, graduated, graduatedDate, amountPaidRate }) => (
  <Section id="certification">
    <div className="container">
      <h2>Certification Logo</h2>
      {graduated
        ? (amountPaidRate >= 1 || (graduatedDate && graduatedDate.getTime() < Date.UTC(2023, 2, 5)))
          ? (
            <>
              <p>Use the HTML code below on your own website to display your certification. Download the PDF to use in printed documents.</p>
              <h3 className="h5">{certificationData.code && <>{certificationData.code}{certificationData.codeRegistered ? <>&reg;</> : <>&trade;</>}&mdash;</>}{certificationData.name}{certificationData.nameTrademarked && <>&trade;</>}</h3>
              <div className="row align-items-center">
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  { /* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/${certificationData.filename}.svg`} style={{ display: 'block', width: '100%', maxWidth: 255, margin: '0 auto 12px' }} alt={certificationData.name} />
                  <div style={{ textAlign: 'center' }}>
                    <a download href={`https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/${certificationData.filename}.pdf`} target="_blank" rel="noreferrer">Download PDF</a>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <p className="code"><span className="a-tag">&lt;a href=<span className="attribute">&quot;{certificationData.url}&quot;</span>&gt;<span className="img-tag">&lt;img src=<span className="attribute">&quot;https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/{certificationData.filename}.svg&quot;</span> height=<span className="attribute">&quot;190&quot;</span> alt=<span className="attribute">&quot;{certificationData.name}&quot;</span> /&gt;</span>&lt;/a&gt;</span></p>
                </div>
              </div>
            </>
          )
          : <p>Congratulations on completing your course! It looks like you have a remaining balance. Your certification logo will display here once your balance has been paid in full. Please visit <Link href="/students/account">your account page</Link> to review your balance and finalize your payments.</p>
        : <p>Once you have graduated from this course, your certification logo will appear here.</p>
      }
    </div>
    <style jsx>{`
    .code{font-family:'Courier New',Courier,monospace;word-wrap:break-word;font-size:15px;line-height:18px}
    .a-tag{color:green}
    .attribute{color:blue}
    .img-tag{color:purple}
    `}</style>
  </Section>
);
