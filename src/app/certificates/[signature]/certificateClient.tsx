'use client';
import { useEffect, useState } from 'react';

import { fetchCertificate } from './fetchCertificate';
import styles from './index.module.css';
import directorSignature from '../../kayla.svg';
import registrarSignature from '../../lucie.svg';
import type { Certificate } from '@/domain/certificate';
import { CertificateWrapper } from 'src/app/students/courses/[courseId]/certificates/CertificateWrapper';

interface PageProps {
  signature: string;
}

const CertificateClient = ({ signature }: PageProps) => {

  const [ certificate, setCertificate ] = useState<Certificate | null>(null);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    fetchCertificate(signature)
      .then(data => setCertificate({
        ...data,
        graduationDate: new Date(data.graduationDate),
      }))
      .catch(() => setError(true));
  }, [ signature ]);

  if (error) {
    console.log(error);
    return (<div>Certificate not found</div>);
  }
  if (!certificate) {
    return (<div>Loading...</div>);
  }

  return (
    <>
      <section>
        <div className="no-print bg-white rounded border mt-4 mb-4 p-4 text-center shadow-sm mx-auto" style={{ maxWidth: '1000px' }}>
          <div
            className="text-uppercase fw-semibold"
            style={{
              letterSpacing: '0.15em',
              color: '#86868B',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
            }}
          >
            Graduate Credential • ID {certificate.signature}
          </div>
        </div>
      </section>
      <div className="text-center">
        <div
          className="mx-auto"
          style={{
            maxWidth: '1000px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <CertificateWrapper
            name={certificate.firstName + ' ' + certificate.lastName}
            schoolName={certificate.schoolName}
            courseName={certificate.courseName}
            registrarSignatureUrl={registrarSignature}
            directorSignatureUrl={directorSignature}
            date={certificate.graduationDate}
          />
        </div>
      </div>
      <section>
        <div className="row justify-content-center mb-4 mt-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className={`no-print rounded-3 p-4 border ${styles.infoCard}`}
            >
              <div className="row g-3 text-center">
                <div className="col-6">
                  <span className={`d-block text-uppercase ${styles.infoLabel}`}>
                    Certification ID
                  </span>

                  <span className={`fw-bold ${styles.infoValue}`}>
                    {certificate.signature}
                  </span>
                </div>

                <div className="col-6">
                  <span
                    className={`d-block text-uppercase ${styles.infoLabel}`}
                  >
                    Issue Date Authority
                  </span>

                  <span
                    className={`fw-bold ${styles.infoValue}`}
                  >
                    {certificate.graduationDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificateClient;
