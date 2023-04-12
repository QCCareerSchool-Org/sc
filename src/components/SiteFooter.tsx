import Image from 'next/image';
import type { FC } from 'react';
import { FaFacebookF, FaGooglePlusG, FaPinterest, FaRss, FaTwitter } from 'react-icons/fa';

import BBBLogo from '@/images/black-seal-250-52-whitetxt-qccareerschool-4175.png';

export const SiteFooter: FC = () => {

  return (
    <>
      <footer id="siteFooter" className="bg-navy text-white mt-auto py-4">
        <div className="container">
          <div className="row">

            <div className="col-12 col-xl-6 mb-4 text-center text-xl-start">
              <h3 className="mb-3">Get Social with QC</h3>
              <a target="_blank" href="http://www.facebook.com/QCCareerSchool" rel="noopener noreferrer"><FaFacebookF className="me-1" /></a>
              <a target="_blank" href="http://twitter.com/QCCareerSchool" rel="noopener noreferrer"><FaTwitter className="me-1" /></a>
              <a target="_blank" href="http://www.pinterest.com/qccareerschool" rel="noopener noreferrer"><FaPinterest className="me-1" /></a>
              <a target="_blank" href="https://plus.google.com/105385015884839432539/" rel="publisher noopener noreferrer"><FaGooglePlusG className="me-1" /></a>
              <a target="_blank" href="http://theblog.qccareerschool.com/" rel="noreferrer"><FaRss /></a>
              <div className="d-none d-xl-block">
                <div style={{ marginTop: '1.25rem', height: 52 }}>
                  <a target="_blank" title="Click for the Business Review of QC Career School, a Correspondence Schools in Ottawa ON" href="http://www.bbb.org/ottawa/business-reviews/correspondence-schools/qc-career-school-in-ottawa-on-4175#sealclick" rel="noreferrer">
                    <Image src={BBBLogo} width={250} height={52} layout="fixed" alt="Click for the BBB Business Review of this Correspondence Schools in Ottawa ON" />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12">
              <hr />
              <span itemScope itemType="http://schema.org/Organization">
                © {(new Date()).getFullYear()} <span itemProp="name">QC Career School</span>.<br />
                <span itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                  <span itemProp="streetAddress">7201 Wisconsin Ave, Suite 440</span> • <span itemProp="addressLocality">Bethesda</span>, <span itemProp="addressRegion">MD</span> • <span itemProp="postalCode">20814</span> • <span itemProp="addressCountry">USA</span> • <span itemProp="telephone">1-833-600-3751</span>
                </span>
              </span>

            </div>

          </div>
        </div>
      </footer>
      <style jsx>{`
      #siteFooter {
        font-size: 12px;
      }
      #siteFooter h3 {
        font-size: 12px;
        color: white;
        font-weight: bold;
      }
      #siteFooter a {
        color: white;
      }
      #siteFooter hr {
        color: #b4b4b4;
        opacity: 1;
      }
      `}</style>
    </>
  );
};
