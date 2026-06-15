import styles from './index.module.css';
import { CertificateView } from '@/components/certificate/CertificateView';
import { CertificateWrapper } from '@/components/certificate/CertificateWrapper';
import { fetchCertificate } from 'src/lib/fetchCertificate';
import type { PageComponent } from 'src/serverComponent';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Params = {
  signature: string;
};

const CertificatePage: PageComponent<Params> = async ({ params }) => {
  const { signature } = await params;
  const certificate = await fetchCertificate(signature);

  return (
    <>
      <section>
        <div className="text-center mt-4">
          <div className="mx-auto" style={{ maxWidth: '1000px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)' }}>
            <CertificateWrapper>
              <CertificateView
                name={certificate.firstName + ' ' + certificate.lastName}
                courseName={certificate.courseName}
                designation={certificate.courseName}
                schoolName={certificate.schoolName}
                date={certificate.graduationDate}
              />
            </CertificateWrapper>
          </div>
        </div>
      </section>
      <section>
        <div className="row justify-content-center mb-4 mt-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className={`no-print rounded-3 p-4 border ${styles.infoCard}`}>
              <div className="row g-3 text-center">
                <div className="col-6">
                  <span className={`d-block text-uppercase ${styles.infoLabel}`}>Certification ID</span>
                  <span className={`fw-bold ${styles.infoValue}`}>{certificate.signature}</span>
                </div>
                <div className="col-6">
                  <span className={`d-block text-uppercase ${styles.infoLabel}`}>Issue Date Authority</span>
                  <span className={`fw-bold ${styles.infoValue}`}>{certificate.graduationDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificatePage;
