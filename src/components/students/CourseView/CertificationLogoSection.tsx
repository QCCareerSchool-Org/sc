import type { FC } from 'react';

import type { CertificationData } from './certificationData';
import { Section } from '@/components/Section';

type Props = {
  certificationData: CertificationData;
  graduated: boolean;
};

export const CertificationLogoSection: FC<Props> = ({ certificationData, graduated }) => (
  <Section>
    <div className="container">
      <h2>Certification Logo</h2>
      {graduated
        ? (
          <>
            <p>Use the HTML code below on your own website to display your certification. Download the PDF to use in printed documents.</p>
            <h3 className="h5">{certificationData.code && <>{certificationData.code}{certificationData.codeRegistered ? <>&reg;</> : <>&trade;</>}&mdash;</>}{certificationData.name}{certificationData.nameTrademarked && <>&trade;</>}</h3>
            <div className="row align-items-center">
              <div className="col-12 col-md-4">
                { /* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/${certificationData.filename}.svg`} style={{ display: 'block', width: '100%', maxWidth: 255, margin: '0 auto 12px' }} alt={certificationData.name} />
                <div style={{ textAlign: 'center' }}>
                  <a download="" href={`https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/${certificationData.filename}.pdf`}>Download PDF</a>
                </div>
              </div>
              <div className="col-12 col-md-8">
                <p className="code"><span className="a-tag">&lt;a href=<span className="attribute">&quot;https://www.qceventplanning.com/&quot;</span>&gt;<span className="img-tag">&lt;img src=<span className="attribute">&quot;https://aeea626a74ffdd96fbcf-77df9cf355bf5239094a1d99115ccf2c.ssl.cf1.rackcdn.com/{certificationData.filename}.svg&quot;</span> alt=<span className="attribute">&quot;{certificationData.name}&quot;</span>&gt;</span>&lt;/a&gt;</span></p>
              </div>
            </div>
          </>
        )
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
