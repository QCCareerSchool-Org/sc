'use client';
import { useEffect, useState } from 'react';

import { fetchCertificate } from './fetchCertificate';
import directorSignature from '../../kayla.svg';
import registrarSignature from '../../lucie.svg';
import type { Certificate } from '@/domain/certificate';
import { CertificateWrapper } from 'src/app/students/courses/[courseId]/certificate/CertificateWrapper';

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
        <div className="container text-center">
          <div className=" bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4">
            CERTIFICATION ID: {certificate.signature}
          </div>
        </div>
      </section>
      <div className="text-center">
        <div
          className="mx-auto"
          style={{
            maxWidth: '1200px',
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
        <div className="container">
          <div className="bg-white text-dark rounded-3 border border-1 p-4 mt-4 mb-4">
            <div className="row justify-content-center text-center">
              <div className="col-12 col-md-4">
                <p className="mb-0">CERTIFICATION ID</p>
                <p className="mb-0">{certificate.signature}</p>
              </div>
              <div className="col-12 col-md-4">
                <p className="mb-0">DATE</p>
                <p className="mb-0">
                  {certificate.graduationDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificateClient;
